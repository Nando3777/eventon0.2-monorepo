import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @ApiOkResponse({ type: HealthResponseDto })
  async health(): Promise<HealthResponseDto> {
    return this.healthService.check();
  }

  @Get('healthz')
  @ApiOkResponse({ type: HealthResponseDto })
  async healthz(): Promise<HealthResponseDto> {
    return this.healthService.check();
  }
}
