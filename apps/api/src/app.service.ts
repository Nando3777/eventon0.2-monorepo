import { Injectable } from '@nestjs/common';
import { HealthCheck } from '@eventon/shared';

@Injectable()
export class AppService {
  getHealth(): HealthCheck {
    return { status: 'ok' };
  }
}
