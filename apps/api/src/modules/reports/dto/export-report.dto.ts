import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReportFormat {
  CSV = 'csv',
  JSON = 'json',
}

export class ExportReportDto {
  @ApiProperty({ enum: ReportFormat, default: ReportFormat.CSV })
  @IsEnum(ReportFormat)
  format: ReportFormat = ReportFormat.CSV;

  @ApiProperty({ description: 'Report type identifier.' })
  @IsString()
  type!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  to?: string;
}
