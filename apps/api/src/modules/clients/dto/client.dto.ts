import { ApiProperty } from '@nestjs/swagger';
import { ClientStatus } from '@eventon/db';

export class ClientDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  email?: string | null;

  @ApiProperty({ required: false })
  phone?: string | null;

  @ApiProperty({ enum: ClientStatus })
  status!: ClientStatus;

  @ApiProperty({ required: false })
  notes?: string | null;
}
