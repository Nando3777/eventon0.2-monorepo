import { ApiProperty } from '@nestjs/swagger';
import { AssignmentStatus } from '@eventon/db';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateResponseDto {
  @ApiProperty()
  @IsString()
  shiftId!: string;

  @ApiProperty()
  @IsString()
  staffProfileId!: string;

  @ApiProperty({ enum: AssignmentStatus })
  @IsEnum(AssignmentStatus)
  status!: AssignmentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
