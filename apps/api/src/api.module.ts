import { Module, ValidationPipe } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../../../config';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@app/auth/src/auth.module';
import { MessageModule } from '@app/message/src/message.module';
import { GateWayModule } from '@/websocket/src/websocket.module';
import { CloudinaryModule } from '@app/cloudinary.module';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
     JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: {expiresIn: '24h'}
      }),
      global: true,
      inject: [ConfigService],
    }),
      AuthModule,
     MessageModule,
     GateWayModule,
     CloudinaryModule
  ],
  controllers: [ApiController],
  providers: [ApiService, ConfigService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    },],
})
export class ApiModule {}






