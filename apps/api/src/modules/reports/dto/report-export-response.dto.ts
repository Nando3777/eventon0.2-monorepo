import { ApiProperty } from '@nestjs/swagger';

export class ReportExportResponseDto {
  @ApiProperty({ description: 'Identifier for the export job.' })
  exportId!: string;

  @ApiProperty({ example: 'processing', enum: ['queued', 'processing', 'completed'] })
  status!: 'queued' | 'processing' | 'completed';

  @ApiProperty()
  requestedAt!: string;

  @ApiProperty({ required: false })
  downloadUrl?: string | null;
}
