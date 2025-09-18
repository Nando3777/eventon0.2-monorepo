import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDto } from './dto/job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'List jobs for the organisation.' })
  @ApiOkResponse({ type: JobDto, isArray: true })
  list(@Param('orgId') orgId: string): Promise<JobDto[]> {
    return this.jobsService.list(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new job.' })
  @ApiOkResponse({ type: JobDto })
  create(@Param('orgId') orgId: string, @Body() payload: CreateJobDto): Promise<JobDto> {
    return this.jobsService.create(orgId, payload);
  }

  @Get(':jobId')
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'Retrieve details for a specific job.' })
  @ApiOkResponse({ type: JobDto })
  get(@Param('orgId') orgId: string, @Param('jobId') jobId: string): Promise<JobDto> {
    return this.jobsService.get(orgId, jobId);
  }

  @Patch(':jobId')
  @ApiOperation({ summary: 'Update an existing job.' })
  @ApiOkResponse({ type: JobDto })
  update(
    @Param('orgId') orgId: string,
    @Param('jobId') jobId: string,
    @Body() payload: UpdateJobDto,
  ): Promise<JobDto> {
    return this.jobsService.update(orgId, jobId, payload);
  }
}
