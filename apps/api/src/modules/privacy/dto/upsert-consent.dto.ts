import { ApiProperty } from '@nestjs/swagger';
import { ConsentScope } from '@eventon/db';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpsertConsentDto {
  @ApiProperty()
  @IsString()
  subjectIdentifier!: string;

  @ApiProperty({ enum: ConsentScope })
  @IsEnum(ConsentScope)
  scope!: ConsentScope;

  @ApiProperty({ description: 'Flag indicating whether consent is granted or revoked.' })
  @IsBoolean()
  granted!: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expiresAt?: string;
}
