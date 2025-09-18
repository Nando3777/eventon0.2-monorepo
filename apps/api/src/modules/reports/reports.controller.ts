import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { ExportReportDto } from './dto/export-report.dto';
import { ReportExportResponseDto } from './dto/report-export-response.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('export')
  @ApiOperation({ summary: 'Request an export for the specified report type.' })
  @ApiOkResponse({ type: ReportExportResponseDto })
  export(
    @Param('orgId') orgId: string,
    @Body() payload: ExportReportDto,
  ): Promise<ReportExportResponseDto> {
    return this.reportsService.export(orgId, payload);
  }
}
