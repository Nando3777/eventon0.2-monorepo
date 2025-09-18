import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class PrivacyExportDto {
  @ApiProperty()
  @IsString()
  subjectIdentifier!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  deliveryEmail?: string;
}

export class PrivacyExportResponseDto {
  @ApiProperty()
  exportId!: string;

  @ApiProperty({ example: 'queued' })
  status!: string;
}
