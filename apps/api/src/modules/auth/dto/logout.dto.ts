import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ description: 'Access token to invalidate.' })
  @IsString()
  token!: string;
}
