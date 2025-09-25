// services/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { ChatsModule } from './modules/chats/chats.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { PostsModule } from './modules/posts/posts.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    UsersModule,
    ChatsModule,
    ReportsModule,
    MetricsModule,
    AnnouncementsModule,
    PostsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
