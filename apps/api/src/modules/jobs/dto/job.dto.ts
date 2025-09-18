import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from '@eventon/db';

export class JobDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: JobStatus })
  status!: JobStatus;

  @ApiProperty({ required: false })
  clientId?: string | null;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty({ required: false })
  location?: string | null;

  @ApiProperty({ required: false })
  remote?: boolean;

  @ApiProperty({ required: false })
  startsAt?: string | null;

  @ApiProperty({ required: false })
  endsAt?: string | null;
}
