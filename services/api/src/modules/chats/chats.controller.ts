// services/api/src/modules/chats/chats.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatsService } from './chats.service';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chats: ChatsService) {}

  @Get()
  list() { return this.chats.list(); }

  @Post('message')
  send(@Body() dto: { chatId: string; senderId: string; content: string }) {
    return this.chats.send(dto);
  }

  @Post(['rooms', 'chat/rooms', 'chats/rooms', 'conversations'])
  createRoom(@Body() dto: { userAId: string; userBId: string; title?: string; category?: string }) {
    return this.chats.createRoom(dto);
  }
}
