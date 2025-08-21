import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class ChatsService {
  async list() {
    return prisma.chat.findMany({ take: 20, orderBy: { lastMessageAt: 'desc' } });
  }
  async send(dto: { chatId: string, senderId: string, content: string }) {
    const msg = await prisma.message.create({
      data: { chatId: dto.chatId, senderId: dto.senderId, content: dto.content }
    });
    await prisma.chat.update({ where: { id: dto.chatId }, data: { lastMessageAt: new Date() } });
    return msg;
  }
}
