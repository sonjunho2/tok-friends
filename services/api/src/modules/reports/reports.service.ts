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
        reportedId: dto.targetUserId ?? null, // 스키마 필드명에 맞춤
        // messageId: dto.messageId ?? null,   // ← 현재 스키마에 없음(컴파일 에러 원인) → 제거
        reason: dto.reason,
        evidenceUrls: dto.evidenceUrls ?? [],
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
