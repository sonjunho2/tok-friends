import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class DiscoverService {
  constructor(private prisma: PrismaService) {}

  async findUsers(filters: { gender?: string; ageMin?: number; ageMax?: number; city?: string }) {
    const where: any = {};
    if (filters.gender) where.gender = filters.gender;
    if (filters.city) where.city = filters.city;
    if (filters.ageMin || filters.ageMax) {
      where.age = {};
      if (filters.ageMin) where.age.gte = filters.ageMin;
      if (filters.ageMax) where.age.lte = filters.ageMax;
    }
    return this.prisma.user.findMany({ where, select: { id: true, email: true, name: true, gender: true, age: true, city: true } });
  }
}
