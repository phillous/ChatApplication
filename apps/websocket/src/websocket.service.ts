import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '@app/schema/user.schema';
import { BadGatewayException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import cookieParser from 'cookie-parser';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Model } from 'mongoose';

import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class GatewayProvider
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  userSocketMap: Record<string, any> = {};

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private User: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  afterInit() {
    console.log('Checking Websocket');
    this.server.use(async (client: Socket, next) => {
      console.log('Client attempting connection');
      console.log('Cookies:', client.handshake.headers.cookie);
      console.log('Auth:', client.handshake.auth);
      try {
        const rawToken = client.handshake.headers.cookie
          ?.split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!rawToken) {
          return next(new WsException('Unauthorized - No Token'));
        }

        const decodedToken = decodeURIComponent(rawToken);

        const signedCookies = cookieParser.signedCookies(
          { token: decodedToken },
          "supersecret",
        );

        const signedToken = signedCookies.token;

        if (!signedToken) {
          return next(new WsException('Unauthorized - Invalid Token'));
        }

        const decoded = this.jwtService.verify(signedToken);

        if (!decoded) {
          throw new WsException('Unauthorized - Token Verification Failed');
        }

        const user = await this.User.findById(decoded._id).select(
          '-password',
        );

        if (!user) {
          return next(new WsException('User not found'));
        }

        client.data.user = user;
        client.data.userId = user._id.toString();
        console.log('Checking Websocket again:', client.data.user.fullName);
        next(); // VERY IMPORTANT
      } catch (err) {
        console.error('WS Auth error:', err.message);
        next(new WsException(err.message));
      }
    });
  }

  async handleConnection(client: any, ...args: any[]) {
    const userId = client.data.userId;
    this.userSocketMap[userId] = client.id;

    try {
      await this.User.findByIdAndUpdate(userId, { active: true });
      console.log('Checking Websocket again:', client.data.user.fullName);
    } catch (err) {
      console.error('Error updating user online status:', err);
    }

    this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
  }

  async handleDisconnect(client: any) {
    const userId = client.data.userId;
    console.log('A user disconnected', client.data.user.fullName);
    delete this.userSocketMap[userId];

    try {
      await this.User.findByIdAndUpdate(userId, { active: false });
    } catch (err) {
      console.error('Error updating user online status:', err);
    }

    this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
  }

  getReceiverSocketId(userId: string) {
    return this.userSocketMap[userId];
  }

  sendNewMessage(message: any, receiverId: string) {
    this.server.to(receiverId).emit('newMessage', message);
  }

  @SubscribeMessage('getOnlineUsers')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    client.emit('reply', 'This is a reply');

    this.server.emit('reply', 'Broadcasting');
  }
}
