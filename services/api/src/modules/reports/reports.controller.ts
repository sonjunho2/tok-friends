import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post()
  create(@Body() dto: { reporterId: string, reason: string, targetUserId?: string, messageId?: string, evidenceUrls?: string[] }) {
    return this.reports.create(dto);
  }

  @Get()
  list(@Query('status') status?: string) { return this.reports.list(status); }
}
