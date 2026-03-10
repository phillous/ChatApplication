import { Controller, Req, Param, Body, Get, Post, Put, Patch, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { MessageService } from '@app/message';
import { CurrentUser } from '@app/decorators/current-user.decorator';
import { AuthGuard } from '@app/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('contacts')
  getAllContacts() {
    return this.messageService.getAllContacts();
  }

  @Post('send/:id')
  sendMessage(@Body() body: any, @CurrentUser() senderId: string, @Param('id') receiverId: string){
    return this.messageService.sendMessage(body, receiverId, senderId);
  }

  @Get('chats')
  getChatPartners(@CurrentUser() userId: string) {
      return this.messageService.getChatPartners(userId);
  }

  @Get(':id')
  getMessagesByUserId(@CurrentUser() userId: string, @Param('id') receiverId: string) {
    return this.messageService.getMessagesByUserId(  receiverId, userId);
  }
}
