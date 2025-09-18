import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { CreateResponseDto } from './dto/create-response.dto';
import { ResponseDto } from './dto/response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { ResponsesService } from './responses.service';

@ApiTags('responses')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get()
  @ApiOperation({ summary: 'List staff responses to shift assignments.' })
  @ApiOkResponse({ type: ResponseDto, isArray: true })
  list(@Param('orgId') orgId: string): Promise<ResponseDto[]> {
    return this.responsesService.list(orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Record a response to a shift assignment.' })
  @ApiOkResponse({ type: ResponseDto })
  create(@Param('orgId') orgId: string, @Body() payload: CreateResponseDto): Promise<ResponseDto> {
    return this.responsesService.create(orgId, payload);
  }

  @Patch(':assignmentId')
  @ApiOperation({ summary: 'Update an existing shift response.' })
  @ApiOkResponse({ type: ResponseDto })
  update(
    @Param('orgId') orgId: string,
    @Param('assignmentId') assignmentId: string,
    @Body() payload: UpdateResponseDto,
  ): Promise<ResponseDto> {
    return this.responsesService.update(orgId, assignmentId, payload);
  }
}
