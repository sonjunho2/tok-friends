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
  send(@Body() dto: { chatId: string, senderId: string, content: string }) {
    return this.chats.send(dto);
  }
}
