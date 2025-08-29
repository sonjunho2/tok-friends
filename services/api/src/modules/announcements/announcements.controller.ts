import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma';

@ApiTags('admin/announcements')
@ApiBearerAuth()
@Controller('admin/announcements')
export class AnnouncementsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async list(@Query('page') page = '1', @Query('limit') limit = '20') {
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (p - 1) * take;

    const [total, rows] = await Promise.all([
      this.prisma.announcement.count(),
      this.prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: { id: true, title: true, body: true, isActive: true, createdAt: true, startsAt: true, endsAt: true },
      }),
    ]);

    return {
      ok: true,
      page: p,
      limit: take,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
      data: rows,
      items: rows,
    };
  }

  @Post()
  async create(@Body() dto: { title: string; body: string; isActive?: boolean; startsAt?: string; endsAt?: string | null }) {
    const created = await this.prisma.announcement.create({
      data: {
        title: dto.title,
        body: dto.body,
        isActive: !!dto.isActive,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    });
    return { ok: true, data: created };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: { title?: string; body?: string; isActive?: boolean; startsAt?: string; endsAt?: string | null },
  ) {
    const updated = await this.prisma.announcement.update({
      where: { id },
      data: {
        title: dto.title,
        body: dto.body,
        isActive: dto.isActive,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt === null ? null : dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    });
    return { ok: true, data: updated };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prisma.announcement.delete({ where: { id } });
    return { ok: true };
  }
}
