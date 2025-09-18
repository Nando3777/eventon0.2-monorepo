import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateOrgDto {
  @ApiProperty({ description: 'Display name for the organisation.' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ description: 'URL friendly slug for the organisation.' })
  @IsString()
  @Length(2, 60)
  slug!: string;

  @ApiProperty({ description: 'Owner user identifier responsible for the organisation.' })
  @IsString()
  ownerId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timezone?: string;
}
