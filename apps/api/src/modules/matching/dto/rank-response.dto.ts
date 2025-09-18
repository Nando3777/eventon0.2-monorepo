import { ApiProperty } from '@nestjs/swagger';

export class RankScoreDto {
  @ApiProperty()
  staffProfileId!: string;

  @ApiProperty({ description: 'Computed score between 0 and 1.' })
  score!: number;
}

export class RankResponseDto {
  @ApiProperty({ type: [RankScoreDto] })
  rankings!: RankScoreDto[];
}
