import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(HealthService.name);
  }

  async check(): Promise<HealthResponseDto> {
    const response = new HealthResponseDto();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      response.database = true;
    } catch (error) {
      this.logger.warn({ err: error }, 'Database health check failed');
      response.status = 'degraded';
      response.database = false;
    }

    return response;
  }
}
