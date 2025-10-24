// services/api/src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        _count: {
          select: {
            posts: true,
            reportsToMe: true,
            messages: true,
          },
        },
      },
    });
  }

  async search(term: string, take: number = 20) {
    const trimmed = term.trim();
    if (!trimmed) return [];

    return this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
          { displayName: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
          {
            profile: {
              nickname: { contains: trimmed, mode: Prisma.QueryMode.insensitive },
            },
          },
        ],
      },
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        createdAt: true,
        profile: { select: { nickname: true, bio: true, interests: true } },
      },
    });
  }

  async updateProfile(
    id: string,
    payload: {
      displayName?: string | null;
      region1?: string | null;
      region2?: string | null;
      bio?: string | null;
      nickname?: string | null;
      interests?: string[];
      marketingOptIn?: boolean;
      headline?: string | null;
      avatarUri?: string | null;
    },
  ) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId: id },
      select: { nickname: true, badges: true, interests: true, visibility: true },
    });

    const profileVisibility = (
      existingProfile?.visibility && typeof existingProfile.visibility === 'object'
        ? { ...existingProfile.visibility }
        : {}
    ) as Record<string, any>;

    if (payload.marketingOptIn !== undefined) {
      profileVisibility.marketingOptIn = payload.marketingOptIn;
    }

    const profileUpdate: Prisma.ProfileUpdateInput = {};

    if (payload.bio !== undefined) {
      profileUpdate.bio = payload.bio ?? null;
    }

    if (payload.interests !== undefined) {
      profileUpdate.interests = payload.interests;
    }

    if (payload.headline !== undefined) {
      profileUpdate.headline = payload.headline ?? null;
    }

    if (payload.avatarUri !== undefined) {
      profileUpdate.avatarUri = payload.avatarUri ?? null;
    }

    if (payload.nickname !== undefined || payload.displayName !== undefined) {
      profileUpdate.nickname =
        payload.nickname ??
        payload.displayName ??
        existingProfile?.nickname ??
        '회원';
    }

    if (payload.marketingOptIn !== undefined) {
      profileUpdate.visibility = profileVisibility as any;
    }

    const updateData: Prisma.UserUpdateInput = {
      displayName: payload.displayName ?? undefined,
      region1: payload.region1 ?? undefined,
      region2: payload.region2 ?? undefined,
    };

    if (Object.keys(profileUpdate).length > 0) {
      updateData.profile = {
        upsert: {
          update: profileUpdate,
          create: {
            nickname:
              payload.nickname ?? payload.displayName ?? existingProfile?.nickname ?? '회원',
            bio: payload.bio ?? null,
            headline: payload.headline ?? null,
            avatarUri: payload.avatarUri ?? null,
            interests: payload.interests ?? existingProfile?.interests ?? [],
            badges: existingProfile?.badges ?? [],
            visibility: Object.keys(profileVisibility).length ? (profileVisibility as any) : undefined,
          },
        },
      };
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        profile: true,
        _count: {
          select: {
            posts: true,
            reportsToMe: true,
            messages: true,
          },
        },
      },
    });
  }
}
