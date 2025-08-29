// services/api/src/modules/reports/admin-reports.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('admin/reports')
@Controller('admin/reports')
export class AdminReportsController {
  constructor(private readonly reports: ReportsService) {}

  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @Get('recent')
  async getRecent(@Query('limit') limit?: string) {
    const n = Number(limit ?? 20) || 20;
    const items = await this.reports.listRecent(n);

    return {
      ok: true,
      total: items.length,
      limit: n,
      items,
      data: items, // 프론트 호환
    };
  }
}
