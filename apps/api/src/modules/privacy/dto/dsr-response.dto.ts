import { ApiProperty } from '@nestjs/swagger';
import { DsrStatus } from '@eventon/db';

export class DsrResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: DsrStatus })
  status!: DsrStatus;

  @ApiProperty()
  subjectIdentifier!: string;
}
