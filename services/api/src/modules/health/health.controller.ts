import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
    constructor(private readonly health: HealthService) {}

  @Public()
  @Get()
  async ok() {
    return this.health.check();
  }
}
