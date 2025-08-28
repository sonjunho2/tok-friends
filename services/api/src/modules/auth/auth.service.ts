import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as argon2 from 'argon2';
import { sign as jwtSign } from 'jsonwebtoken';
import { EmailSignupDto } from './dto/email-signup.dto';
import { EmailLoginDto } from './dto/email-login.dto';
import { AppleTokenDto } from './dto/apple-token.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        'JWT_SECRET is not set. Please configure it as an environment variable on the server.',
      );
    }
    return secret;
  }

  private makeToken(payload: any) {
    return jwtSign(payload, this.getJwtSecret(), { expiresIn: '7d' });
  }

  async signupEmail(dto: EmailSignupDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (exists) {
      throw new BadRequestException('Email already registered');
    }

    const hashed = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        provider: 'email',
        // phoneHash: '' // schema가 optional이므로 불필요. 꼭 필요하면 빈문자 유지 가능
        passwordHash: hashed,
        displayName: (dto as any).displayName ?? null,
        dob: new Date(dto.dob),
        gender: dto.gender,
      },
      select: { id: true, email: true, displayName: true },
    });

    const token = this.makeToken({ sub: user.id });
    return { user, token, access_token: token }; // 프론트 호환
  }

  async loginEmail(dto: EmailLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, displayName: true, passwordHash: true },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.makeToken({ sub: user.id });
    return {
      user: { id: user.id, email: user.email, displayName: user.displayName ?? null },
      token,
      access_token: token, // 프론트 호환
    };
  }

  async loginApple(_dto: AppleTokenDto) {
    throw new BadRequestException('Apple login not implemented yet');
  }
}
