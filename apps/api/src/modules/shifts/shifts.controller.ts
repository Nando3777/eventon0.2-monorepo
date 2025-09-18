import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ShiftDto } from './dto/shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftsService } from './shifts.service';

@ApiTags('shifts')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'List shifts for the organisation.' })
  @ApiOkResponse({ type: ShiftDto, isArray: true })
  list(@Param('orgId') orgId: string): Promise<ShiftDto[]> {
    return this.shiftsService.list(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shift.' })
  @ApiOkResponse({ type: ShiftDto })
  create(@Param('orgId') orgId: string, @Body() payload: CreateShiftDto): Promise<ShiftDto> {
    return this.shiftsService.create(orgId, payload);
  }

  @Get(':shiftId')
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'Retrieve details for a shift.' })
  @ApiOkResponse({ type: ShiftDto })
  get(@Param('orgId') orgId: string, @Param('shiftId') shiftId: string): Promise<ShiftDto> {
    return this.shiftsService.get(orgId, shiftId);
  }

  @Patch(':shiftId')
  @ApiOperation({ summary: 'Update an existing shift.' })
  @ApiOkResponse({ type: ShiftDto })
  update(
    @Param('orgId') orgId: string,
    @Param('shiftId') shiftId: string,
    @Body() payload: UpdateShiftDto,
  ): Promise<ShiftDto> {
    return this.shiftsService.update(orgId, shiftId, payload);
  }
}
