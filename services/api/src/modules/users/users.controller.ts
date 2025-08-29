import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // 내 정보 조회 (JWT 토큰 기반)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: any) {
    const userData = await this.users.byId(user.sub);
    if (!userData) throw new NotFoundException('User not found');
    return {
      ok: true,
      data: {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        status: userData.status,
        createdAt: userData.createdAt,
        profile: userData.profile ?? null,
      },
    };
  }

  // 공용/모바일에서 단건 조회 시 사용 예시
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.users.byId(id);
    if (!user) throw new NotFoundException('User not found');
    return {
      ok: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        status: user.status,
        createdAt: user.createdAt,
        profile: user.profile ?? null,
      },
    };
  }
}
