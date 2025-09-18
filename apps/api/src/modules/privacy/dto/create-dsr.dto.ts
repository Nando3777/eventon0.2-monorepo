import { ApiProperty } from '@nestjs/swagger';
import { DsrType } from '@eventon/db';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateDsrDto {
  @ApiProperty()
  @IsString()
  subjectIdentifier!: string;

  @ApiProperty({ enum: DsrType })
  @IsEnum(DsrType)
  type!: DsrType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
