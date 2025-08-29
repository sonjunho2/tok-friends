// services/api/src/modules/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // 최근 신고 n건 (기본 정렬: 최신 생성순)
  async listRecent(limit: number) {
    // reporter/reported/post 연관 정보 일부 포함
    const rows = await this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        reporter: { select: { id: true, email: true, displayName: true } },
        reported: { select: { id: true, email: true, displayName: true } },
        post: { select: { id: true, topicId: true, createdAt: true } },
      },
    });

    // 프론트에서 보기 편한 형태로 가공(필요 시)
    return rows.map((r) => ({
      id: r.id,
      reason: r.reason,
      status: r.status, // ReportStatus enum
      createdAt: r.createdAt,
      reporter: r.reporter,
      reported: r.reported,
      post: r.post,
    }));
  }

  // 상태별 목록(필요 시)
  async listByStatus(status?: ReportStatus) {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }
}
