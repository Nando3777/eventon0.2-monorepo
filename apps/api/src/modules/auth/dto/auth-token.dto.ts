import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty({ description: 'Bearer token issued to the user.' })
  accessToken!: string;

  @ApiProperty({ enum: ['bearer'], default: 'bearer' })
  tokenType = 'bearer' as const;

  @ApiProperty({ description: 'Token lifetime in seconds.', example: 3600 })
  expiresIn!: number;
}
