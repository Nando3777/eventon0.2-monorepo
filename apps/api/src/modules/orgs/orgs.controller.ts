import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { CreateOrgDto } from './dto/create-org.dto';
import { OrgDto } from './dto/org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { OrgsService } from './orgs.service';

@ApiTags('organisations')
@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Get()
  @ApiOperation({ summary: 'List organisations available to the current user.' })
  @ApiOkResponse({ type: OrgDto, isArray: true })
  list(): Promise<OrgDto[]> {
    return this.orgsService.list();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organisation.' })
  @ApiOkResponse({ type: OrgDto })
  create(@Body() payload: CreateOrgDto): Promise<OrgDto> {
    return this.orgsService.create(payload);
  }

  @Get(':orgId')
  @UseGuards(OrgRoleGuard)
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'Retrieve details for the specified organisation.' })
  @ApiOkResponse({ type: OrgDto })
  get(@Param('orgId') orgId: string): Promise<OrgDto> {
    return this.orgsService.get(orgId);
  }

  @Put(':orgId')
  @UseGuards(OrgRoleGuard)
  @OrgRoles(OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'Update organisation metadata.' })
  @ApiOkResponse({ type: OrgDto })
  update(@Param('orgId') orgId: string, @Body() payload: UpdateOrgDto): Promise<OrgDto> {
    return this.orgsService.update(orgId, payload);
  }
}
