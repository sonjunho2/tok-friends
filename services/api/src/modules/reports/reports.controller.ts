import { Controller, Get, Query } from '@nestjs/common';

@Controller('admin/reports')
export class AdminReportsController {
  /**
   * 최근 신고 목록 (우선 더미)
   * 프론트 쪽에서 어떤 형태를 기대하든 안전하게 쓰도록
   * items 와 data 두 키를 모두 제공합니다.
   */
  @Get('recent')
  async getRecent(@Query('limit') limit?: string) {
    const n = Number(limit ?? 20) || 20;
    const items: any[] = []; // 나중에 실제 신고 데이터로 교체
    return {
      ok: true,
      total: 0,
      limit: n,
      items,
      data: items,
    };
  }
}
