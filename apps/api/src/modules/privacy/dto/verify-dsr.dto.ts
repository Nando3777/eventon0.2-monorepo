import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerifyDsrDto {
  @ApiProperty()
  @IsString()
  requestId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  verificationCode?: string;

  @ApiProperty({ description: 'Marks the request as verified when true.' })
  @IsBoolean()
  verified!: boolean;
}
