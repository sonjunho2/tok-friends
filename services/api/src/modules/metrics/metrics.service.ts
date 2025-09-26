import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [users, posts, chats, reports, announcements, bannedWords] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.chat.count(),
      this.prisma.report.count(),
      this.prisma.announcement.count({ where: { isActive: true } }),
      this.prisma.bannedWord.count(),
    ]);

    return {
      users,
      posts,
      chats,
      reports,
      activeAnnouncements: announcements,
      bannedWords,
    };
  }
}
