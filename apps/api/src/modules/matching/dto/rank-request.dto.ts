import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class RankRequestDto {
  @ApiProperty({ description: 'Job identifier to generate rankings for.' })
  @IsString()
  jobId!: string;

  @ApiProperty({ type: [String], description: 'Candidate staff profile identifiers.' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  staffProfileIds!: string[];
}
