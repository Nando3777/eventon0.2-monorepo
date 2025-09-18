import { ApiProperty } from '@nestjs/swagger';
import { MemberStatus, OrgRole } from '@eventon/db';

export class InviteDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: OrgRole })
  role!: OrgRole;

  @ApiProperty({ enum: MemberStatus })
  status!: MemberStatus;

  @ApiProperty({ required: false })
  invitedAt?: string | null;
}
