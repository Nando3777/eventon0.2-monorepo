import { ApiProperty } from '@nestjs/swagger';
import { ConsentScope } from '@eventon/db';

export class ConsentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  subjectIdentifier!: string;

  @ApiProperty({ enum: ConsentScope })
  scope!: ConsentScope;

  @ApiProperty()
  grantedAt!: string;

  @ApiProperty({ required: false })
  revokedAt?: string | null;
}
