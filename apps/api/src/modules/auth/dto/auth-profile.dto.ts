import { ApiProperty } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';

export class AuthProfileDto {
  @ApiProperty({ description: 'User identifier.' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ type: [String], enum: OrgRole, description: 'Roles granted across organisations.' })
  roles: OrgRole[] = [];
}
