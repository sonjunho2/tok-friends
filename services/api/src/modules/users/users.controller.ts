// services/api/src/modules/users/users.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  // 예: 모바일/공용에서 사용하는 단건 조회
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return { ok: true, data: user };
  }
}
