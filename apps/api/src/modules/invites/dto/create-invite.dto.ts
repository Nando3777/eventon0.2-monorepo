import { ApiProperty } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({ description: 'Email address of the invitee.' })
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: OrgRole, default: OrgRole.STAFF })
  @IsEnum(OrgRole)
  role: OrgRole = OrgRole.STAFF;
}
