import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffMemberDto } from './dto/staff-member.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffService } from './staff.service';

@ApiTags('staff')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'List staff members for the organisation.' })
  @ApiOkResponse({ type: StaffMemberDto, isArray: true })
  list(@Param('orgId') orgId: string): Promise<StaffMemberDto[]> {
    return this.staffService.list(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a staff member profile.' })
  @ApiOkResponse({ type: StaffMemberDto })
  create(@Param('orgId') orgId: string, @Body() payload: CreateStaffDto): Promise<StaffMemberDto> {
    return this.staffService.create(orgId, payload);
  }

  @Get(':staffId')
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'Fetch an individual staff member profile.' })
  @ApiOkResponse({ type: StaffMemberDto })
  get(@Param('orgId') orgId: string, @Param('staffId') staffId: string): Promise<StaffMemberDto> {
    return this.staffService.get(orgId, staffId);
  }

  @Patch(':staffId')
  @ApiOperation({ summary: 'Update fields on a staff member profile.' })
  @ApiOkResponse({ type: StaffMemberDto })
  update(
    @Param('orgId') orgId: string,
    @Param('staffId') staffId: string,
    @Body() payload: UpdateStaffDto,
  ): Promise<StaffMemberDto> {
    return this.staffService.update(orgId, staffId, payload);
  }
}
