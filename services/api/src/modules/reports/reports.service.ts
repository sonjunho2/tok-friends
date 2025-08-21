import { ReportStatus } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ReportsService {
  async create(dto: any) {
    return prisma.report.create({
      data: {
        reporterId: dto.reporterId,
        reportedId: dto.targetUserId ?? null,
        // postId: dto.postId ?? null, // 스키마에 postId가 있을 때만 사용
        reason: dto.reason,
        status: ReportStatus.PENDING,
      },
    });
  }

  async list(status?: string) {
    const normalized = status?.toUpperCase() as keyof typeof ReportStatus | undefined;
    const statusEnum = normalized ? ReportStatus[normalized] : undefined;

    return prisma.report.findMany({
      where: statusEnum ? { status: statusEnum } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }
}
