import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async byId(id: string) {
    return prisma.user.findUnique({ where: { id }, include: { profile: true } });
  }
}
