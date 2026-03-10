import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '@app/schema/message.schema';
import { User, UserDocument } from '@app/schema/user.schema';
import { GatewayProvider } from '@/websocket/src/websocket.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private Message: Model<MessageDocument>,
    @InjectModel(User.name) private User: Model<UserDocument>,
    @Inject('CLOUDINARY') private cloudinary: any,
    private gatewayProvider : GatewayProvider
  ) {}

  async getAllContacts() {
    const filteredUsers = await this.User.find({
        active: true
    }).select('-password');
    return filteredUsers;
  }

  async getMessagesByUserId(userId: string, id: string) {
    const messages = await this.Message.find({
      $or: [
        { senderId: userId, receiverId: id },
        { senderId: id, receiverId: userId },
      ],
    });
    return messages;
  }

  async sendMessage({text, image}: any, receiverId: string, senderId: string) {

    if (!text && !image) {
      throw new BadRequestException('Message must contain text or an image');
    }
    if (senderId === receiverId) {
      throw new BadRequestException("Cannot send messages to yourself.");
    }
    const receiverExists = await this.User.exists({ _id: receiverId });
    if (!receiverExists) {
      throw new BadRequestException("Receiver not found.");
    }

    let imageUrl: any;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await this.cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new this.Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = this.gatewayProvider.getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      this.gatewayProvider.sendNewMessage(newMessage, receiverSocketId);
    }

    return newMessage;
  }

  async getChatPartners(userId: string) {
    const loggedInUserId = userId;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await this.Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    if(!messages || messages.length === 0) {
      throw new BadRequestException('No messages found for this user');
    }

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await this.User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    if(!chatPartners) {
      throw new BadRequestException('No chat partners found');
    }

    return chatPartners;
  }
}
