// services/api/src/modules/users/users.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

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
