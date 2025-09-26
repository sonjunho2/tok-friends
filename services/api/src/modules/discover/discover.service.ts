/services/api/src/modules/discover/discover.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

type Filters = {
  gender?: string;
  ageMin?: number; // 최소 나이
  ageMax?: number; // 최대 나이
  region?: string; // region1 또는 region2 매칭
};

function yearsAgo(base: Date, years: number) {
  return new Date(base.getFullYear() - years, base.getMonth(), base.getDate());
}

@Injectable()
export class DiscoverService {
  constructor(private prisma: PrismaService) {}

  async findUsers(filters: Filters) {
    const now = new Date();
    const where: Prisma.UserWhereInput = {};

    if (filters?.gender) {
      where.gender = filters.gender;
    }

    // 나이 -> 생년월일(dob) 범위로 변환
    // ageMin 이상 => dob <= yearsAgo(ageMin)
    // ageMax 이하 => dob >= yearsAgo(ageMax + 1)
    if (typeof filters?.ageMin === 'number' || typeof filters?.ageMax === 'number') {
      const dob: Prisma.DateTimeFilter = {};
      if (typeof filters.ageMin === 'number') {
        dob.lte = yearsAgo(now, filters.ageMin);
      }
      if (typeof filters.ageMax === 'number') {
        dob.gte = yearsAgo(now, filters.ageMax + 1);
      }
      where.dob = dob;
    }

    // 지역 필터(region1 / region2 중 하나라도 포함)
    if (filters?.region) {
      where.OR = [
        { region1: { contains: filters.region } },
        { region2: { contains: filters.region } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        dob: true,
        region1: true,
        region2: true,
      },
    });
  }
}
