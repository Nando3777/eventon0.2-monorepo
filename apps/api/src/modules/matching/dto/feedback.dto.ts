import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SubmitFeedbackDto {
  @ApiProperty()
  @IsString()
  shiftId!: string;

  @ApiProperty()
  @IsString()
  staffProfileId!: string;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  score!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}

export class FeedbackResponseDto {
  @ApiProperty({ example: true })
  accepted!: boolean;
}
