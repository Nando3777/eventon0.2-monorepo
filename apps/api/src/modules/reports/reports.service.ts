import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { ExportReportDto } from './dto/export-report.dto';
import { ReportExportResponseDto } from './dto/report-export-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(ReportsService.name);
  }

  async export(orgId: string, payload: ExportReportDto): Promise<ReportExportResponseDto> {
    const timestamp = new Date();
    try {
      await this.prisma.auditEvent.create({
        data: {
          organisationId: orgId,
          userId: 'system',
          action: `report.export.${payload.type}`,
          entityType: 'report',
          entityId: orgId,
          metadata: payload,
        },
      });
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Audit trail write failed for report export');
    }

    return {
      exportId: `export-${timestamp.getTime()}`,
      status: 'queued',
      requestedAt: timestamp.toISOString(),
      downloadUrl: null,
    };
  }
}
