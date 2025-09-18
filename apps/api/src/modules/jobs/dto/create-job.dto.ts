import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from '@eventon/db';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ description: 'Job title visible to staff.' })
  @IsString()
  @Length(2, 160)
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: JobStatus, default: JobStatus.DRAFT })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus = JobStatus.DRAFT;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  remote?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
