import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ description: 'User identifier for the staff member.' })
  @IsString()
  userId!: string;

  @ApiProperty({ required: false, maxLength: 160 })
  @IsOptional()
  @IsString()
  @Length(0, 160)
  headline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}
