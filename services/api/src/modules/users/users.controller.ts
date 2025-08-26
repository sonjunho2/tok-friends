// services/api/src/modules/users/users.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async byId(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        dob: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        provider: true,
        region1: true,
        region2: true,
        lang: true,
        trustScore: true,
        status: true,
        role: true,
      },
    });
  }
}
