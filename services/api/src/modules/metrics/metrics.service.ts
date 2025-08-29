// services/api/src/modules/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ReportStatus } from '@prisma/client'; // ✅ enum 타입 사용

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    // 기간 기준값
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 병렬 집계
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalReports,
      pendingReports,
      topicCount,
      newDay,
      newWeek,
      newMonth,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'active' } }),
      this.prisma.user.count({ where: { status: 'suspended' } }),
      this.prisma.report.count(),
      this.prisma.report.count({ where: { status: ReportStatus.PENDING } }), // ✅ enum
      this.prisma.topic.count(),
      this.prisma.user.count({ where: { createdAt: { gte: dayAgo } } }),
      this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    ]);

    // ❗ 스키마에 BannedWord/Announcement 모델이 없음 → 실제값 = 0
    // (필요 시 모델 추가/엔드포인트 구현 후 여기서 실제 카운트로 교체)
    const bannedWords = 0;
    const activeAnnouncements = 0;

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
      bannedWords,
      activeAnnouncements,
      newUsers: {
        day: newDay,
        week: newWeek,
        month: newMonth,
      },
    };
  }
}
