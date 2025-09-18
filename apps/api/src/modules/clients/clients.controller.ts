import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { ClientsService } from './clients.service';
import { ClientDto } from './dto/client.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'List clients for the organisation.' })
  @ApiOkResponse({ type: ClientDto, isArray: true })
  list(@Param('orgId') orgId: string): Promise<ClientDto[]> {
    return this.clientsService.list(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new client under the organisation.' })
  @ApiOkResponse({ type: ClientDto })
  create(@Param('orgId') orgId: string, @Body() payload: CreateClientDto): Promise<ClientDto> {
    return this.clientsService.create(orgId, payload);
  }

  @Get(':clientId')
  @OrgRoles(OrgRole.VIEWER, OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
  @ApiOperation({ summary: 'Fetch a specific client record.' })
  @ApiOkResponse({ type: ClientDto })
  get(@Param('orgId') orgId: string, @Param('clientId') clientId: string): Promise<ClientDto> {
    return this.clientsService.get(orgId, clientId);
  }

  @Patch(':clientId')
  @ApiOperation({ summary: 'Update fields on a client record.' })
  @ApiOkResponse({ type: ClientDto })
  update(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Body() payload: UpdateClientDto,
  ): Promise<ClientDto> {
    return this.clientsService.update(orgId, clientId, payload);
  }
}
