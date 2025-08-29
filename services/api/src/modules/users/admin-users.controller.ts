// services/api/src/modules/users/admin-users.controller.ts
import { Controller, Get, Patch, Query, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@ApiTags('admin/users')
@ApiBearerAuth()
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'kim' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (p - 1) * take;

    const where: Prisma.UserWhereInput | undefined = search
      ? {
          OR: [
            { email: { contains: search } },        // 타입 충돌 방지를 위해 mode 제거(대소문자 구분은 필요 시 ilike 로 교체)
            { displayName: { contains: search } },
          ],
        }
      : undefined;

    const [total, rows] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          email: true,
          displayName: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const data = rows.map((u) => ({
      id: u.id,
      email: u.email,
      nickname: u.displayName,
      status: String(u.status).toUpperCase(), // ACTIVE/SUSPENDED 등
      createdAt: u.createdAt,
    }));

    return {
      ok: true,
      page: p,
      limit: take,
      total,
      totalPages: Math.max(1, Math.ceil(total / take)),
      data,
      items: data,
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const next = String(body?.status || '').toLowerCase();
    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: next },
      select: { id: true, email: true, status: true },
    });
    return { ok: true, data: updated };
  }
}
