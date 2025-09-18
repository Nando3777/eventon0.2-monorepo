import { ApiProperty } from '@nestjs/swagger';
import { ShiftStatus } from '@eventon/db';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ description: 'Associated job identifier.' })
  @IsString()
  jobId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsDateString()
  startTime!: string;

  @ApiProperty()
  @IsDateString()
  endTime!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ required: false, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  requiredStaff?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ enum: ShiftStatus, default: ShiftStatus.PLANNED })
  @IsOptional()
  @IsEnum(ShiftStatus)
  status?: ShiftStatus = ShiftStatus.PLANNED;
}
