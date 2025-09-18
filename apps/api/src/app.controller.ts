import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { healthCheckSchema } from '@eventon/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthz')
  getHealth() {
    const payload = this.appService.getHealth();
    return healthCheckSchema.parse(payload);
  }
}
