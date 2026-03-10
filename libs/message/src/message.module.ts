import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from '@/api/src/message/message.controller';

import { GateWayModule } from '@/websocket/src/websocket.module';
import { Message, MessageSchema } from '@app/schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/schema/user.schema';
import { CloudinaryModule } from '@app/cloudinary.module';


@Module({
  imports: [GateWayModule, CloudinaryModule, MongooseModule.forFeature([
        { name: Message.name, schema: MessageSchema },
        {name: User.name, schema: UserSchema}
      ])],
  controllers: [MessageController],
  providers: [MessageService, ],
})
export class MessageModule {}
