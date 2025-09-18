import { ApiProperty } from '@nestjs/swagger';

export class StaffMemberDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ required: false })
  headline?: string | null;

  @ApiProperty({ required: false })
  bio?: string | null;
}
