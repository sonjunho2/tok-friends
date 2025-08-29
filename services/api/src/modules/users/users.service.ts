// services/api/src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }
}
