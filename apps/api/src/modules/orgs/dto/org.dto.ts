import { ApiProperty } from '@nestjs/swagger';

export class OrgDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty({ required: false })
  timezone?: string | null;
}
