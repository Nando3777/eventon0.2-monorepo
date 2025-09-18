import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { RankRequestDto } from './dto/rank-request.dto';
import { RankResponseDto } from './dto/rank-response.dto';
import { FeedbackResponseDto, SubmitFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(MatchingService.name);
  }

  async rank(orgId: string, payload: RankRequestDto): Promise<RankResponseDto> {
    try {
      await this.prisma.job.findFirst({ where: { id: payload.jobId, organisationId: orgId } });
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Job lookup failed during ranking');
    }

    const rankings = payload.staffProfileIds.map((staffId, index) => ({
      staffProfileId: staffId,
      score: Number(((payload.staffProfileIds.length - index) / payload.staffProfileIds.length).toFixed(2)),
    }));

    return { rankings };
  }

  async submitFeedback(orgId: string, payload: SubmitFeedbackDto): Promise<FeedbackResponseDto> {
    try {
      await this.prisma.matchFeedback.create({
        data: {
          organisationId: orgId,
          shiftId: payload.shiftId,
          staffProfileId: payload.staffProfileId,
          score: Math.round(payload.score * 20),
          comment: payload.comments,
        },
      });
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Unable to persist match feedback');
    }

    return { accepted: true };
  }
}
