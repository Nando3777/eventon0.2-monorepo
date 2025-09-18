import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrgRole } from '@eventon/db';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgRoleGuard } from '../../common/guards/org-role.guard';
import { FeedbackResponseDto, SubmitFeedbackDto } from './dto/feedback.dto';
import { RankRequestDto } from './dto/rank-request.dto';
import { RankResponseDto } from './dto/rank-response.dto';
import { MatchingService } from './matching.service';

@ApiTags('matching')
@UseGuards(OrgRoleGuard)
@OrgRoles(OrgRole.MANAGER, OrgRole.ADMIN, OrgRole.OWNER)
@Controller('orgs/:orgId/matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('rank')
  @ApiOperation({ summary: 'Rank staff profiles for a job.' })
  @ApiOkResponse({ type: RankResponseDto })
  rank(@Param('orgId') orgId: string, @Body() payload: RankRequestDto): Promise<RankResponseDto> {
    return this.matchingService.rank(orgId, payload);
  }

  @Post('feedback')
  @ApiOperation({ summary: 'Submit feedback for a completed match.' })
  @ApiOkResponse({ type: FeedbackResponseDto })
  submitFeedback(
    @Param('orgId') orgId: string,
    @Body() payload: SubmitFeedbackDto,
  ): Promise<FeedbackResponseDto> {
    return this.matchingService.submitFeedback(orgId, payload);
  }
}
