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

  /**
   * ★ 변경 포인트: 환경변수 JWT_SECRET이 없으면 즉시 에러를 던집니다.
   *   - 운영에서 실수로 약한/기본 키로 서명되는 것을 방지
   */
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
    // ★ 변경 포인트: 더 이상 'dev_secret' 같은 기본값을 쓰지 않음
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
        phoneHash: '', // NOT NULL 대응
        passwordHash: hashed,
        displayName: (dto as any).displayName ?? null, // DTO에 displayName이 있으면 사용
        dob: new Date(dto.dob),
        gender: dto.gender,
      },
      select: { id: true, email: true, displayName: true },
    });

    const token = this.makeToken({ sub: user.id });
    return { user, token };
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
    };
  }

  async loginApple(_dto: AppleTokenDto) {
    // TODO: 실제 Apple 토큰 검증 로직 추가 필요(현재는 의도적으로 미구현)
    throw new BadRequestException('Apple login not implemented yet');
  }
}
