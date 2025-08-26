// services/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { TopicsModule } from './modules/topics/topics.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommunityModule } from './modules/community/community.module';
//import { MetricsModule } from './modules/metrics/metrics.module';
import { JwtAuthGuard } from './modules/auth/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    HealthModule,
    TopicsModule,
    PostsModule,
    CommunityModule,
    MetricsModule, // 새로 추가
  ],
  providers: [
    // 전역 Guard 설정 - 모든 라우트에 JWT 인증 적용 (단, @Public() 제외)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
