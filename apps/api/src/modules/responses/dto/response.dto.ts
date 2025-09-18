import { ApiProperty } from '@nestjs/swagger';
import { AssignmentStatus } from '@eventon/db';

export class ResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  shiftId!: string;

  @ApiProperty()
  staffProfileId!: string;

  @ApiProperty({ enum: AssignmentStatus })
  status!: AssignmentStatus;

  @ApiProperty({ required: false })
  respondedAt?: string | null;

  @ApiProperty({ required: false })
  notes?: string | null;
}
