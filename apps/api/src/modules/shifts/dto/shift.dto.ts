import { ApiProperty } from '@nestjs/swagger';
import { ShiftStatus } from '@eventon/db';

export class ShiftDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  jobId!: string;

  @ApiProperty({ enum: ShiftStatus })
  status!: ShiftStatus;

  @ApiProperty({ required: false })
  title?: string | null;

  @ApiProperty()
  startTime!: string;

  @ApiProperty()
  endTime!: string;

  @ApiProperty({ required: false })
  timezone?: string | null;

  @ApiProperty({ required: false })
  requiredStaff?: number;

  @ApiProperty({ required: false })
  notes?: string | null;
}
