import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { Types, Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true, ref: 'User' })
    senderId: Types.ObjectId;

    @Prop({ required: true, ref: 'User' })
    receiverId: Types.ObjectId;

    @Prop({ required: true, maxlength: 2000, trim: true })
    text: string;

    @Prop()
    image: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);