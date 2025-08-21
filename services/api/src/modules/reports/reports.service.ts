import { ReportStatus, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class ReportsService {
  async create(dto: any) {
    return prisma.report.create({ data: {
      reporterId: dto.reporterId,
      targetUserId: dto.targetUserId,
      messageId: dto.messageId,
      reason: dto.reason,
      evidenceUrls: dto.evidenceUrls || [],
      status: ReportStatus.PENDING
    }});
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
