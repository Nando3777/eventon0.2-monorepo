import { ApiProperty } from '@nestjs/swagger';
import { ClientStatus } from '@eventon/db';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'Display name for the client.' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: ClientStatus, default: ClientStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus = ClientStatus.ACTIVE;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
