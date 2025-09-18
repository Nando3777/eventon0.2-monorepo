import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InviteDto } from './dto/invite.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get()
  @ApiOperation({ summary: 'List pending invitations for the organisation.' })
  @ApiOkResponse({ type: InviteDto, isArray: true })
  list(@Param('orgId') orgId: string): Promise<InviteDto[]> {
    return this.invitesService.list(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Send an invitation to a prospective member.' })
  @ApiOkResponse({ type: InviteDto })
  create(@Param('orgId') orgId: string, @Body() payload: CreateInviteDto): Promise<InviteDto> {
    return this.invitesService.create(orgId, payload);
  }
}
