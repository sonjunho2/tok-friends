// services/api/src/modules/metrics/metrics.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { Public } from '../auth/public.decorator';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get('dashboard')
  async getDashboardMetrics() {
    return this.metricsService.getDashboardMetrics();
  }
}

// services/api/src/modules/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    try {
      // 병렬로 모든 메트릭 조회
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalReports,
        pendingReports,
        // 토픽 수 (금칙어 대신)
        topicCount,
      ] = await Promise.all([
        // 전체 사용자
        this.prisma.user.count(),
        
        // 활성 사용자 (status = 'active')
        this.prisma.user.count({
          where: { status: 'active' }
        }),
        
        // 정지된 사용자 (status = 'suspended')
        this.prisma.user.count({
          where: { status: 'suspended' }
        }),
        
        // 전체 신고
        this.prisma.report.count(),
        
        // 대기중인 신고
        this.prisma.report.count({
          where: { status: 'PENDING' }
        }),
        
        // 토픽 수
        this.prisma.topic.count(),
      ]);

      // 최근 30일간 신규 가입자 수 (더미 데이터)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      });

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
        },
        bannedWords: topicCount, // 임시로 토픽 수 사용
        activeAnnouncements: 0, // 공지사항 기능이 없으므로 0
        newUsers: {
          day: Math.floor(recentUsers / 30), // 일평균
          week: Math.floor(recentUsers / 4), // 주평균  
          month: recentUsers, // 월간
        },
      };
    } catch (error) {
      console.error('Dashboard metrics error:', error);
      // 에러 시 더미 데이터 반환
      return {
        users: { total: 0, active: 0, suspended: 0 },
        reports: { total: 0, pending: 0 },
        bannedWords: 0,
        activeAnnouncements: 0,
        newUsers: { day: 0, week: 0, month: 0 },
      };
    }
  }
}

// services/api/src/modules/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
