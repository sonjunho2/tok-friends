// services/api/src/modules/metrics/metrics.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
