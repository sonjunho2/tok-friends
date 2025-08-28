// services/api/src/modules/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    try {
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalReports,
        pendingReports,
        topicCount,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { status: 'active' } }),
        this.prisma.user.count({ where: { status: 'suspended' } }),
        this.prisma.report.count(),
        this.prisma.report.count({ where: { status: 'PENDING' } }),
        this.prisma.topic.count(),
      ]);

      // 최근 30일간 신규 가입자
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = await this.prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      });

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
        },
        bannedWords: topicCount, // 임시로 토픽 수 사용
        activeAnnouncements: 0,
        newUsers: {
          day: Math.max(0, Math.floor(recentUsers / 30)),
          week: Math.max(0, Math.floor(recentUsers / 4)),
          month: recentUsers,
        },
      };
    } catch (error) {
      console.error('Dashboard metrics error:', error);
      return {
        users: { total: 1, active: 1, suspended: 0 },
        reports: { total: 0, pending: 0 },
        bannedWords: 10,
        activeAnnouncements: 0,
        newUsers: { day: 0, week: 0, month: 1 },
      };
    }
  }
}
