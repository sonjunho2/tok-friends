// services/api/src/modules/chats/chats.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class ChatsService {
  async list() {
    return prisma.chat.findMany({ take: 20, orderBy: { lastMessageAt: 'desc' } });
  }

  async send(dto: { chatId: string; senderId: string; content: string }) {
    const msg = await prisma.message.create({
      data: { chatId: dto.chatId, senderId: dto.senderId, content: dto.content },
    });
    await prisma.chat.update({ where: { id: dto.chatId }, data: { lastMessageAt: new Date() } });
    return msg;
  }

  async createRoom(dto: { userAId: string; userBId: string; title?: string; category?: string }) {
    const chat = await prisma.chat.create({
      data: {
        userAId: dto.userAId,
        userBId: dto.userBId,
        lastMessageAt: new Date(),
      },
    });
    return {
      ok: true,
      id: chat.id,
      userAId: chat.userAId,
      userBId: chat.userBId,
      title: dto.title ?? '',
      category: dto.category ?? '',
    };
  }
}
