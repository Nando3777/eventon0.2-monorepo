import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ enum: ['ok', 'degraded'], default: 'ok' })
  status: 'ok' | 'degraded' = 'ok';

  @ApiProperty({ description: 'Indicates if the database connection succeeded.' })
  database = false;
}
