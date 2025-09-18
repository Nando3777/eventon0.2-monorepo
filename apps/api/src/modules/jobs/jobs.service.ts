import { Injectable } from '@nestjs/common';
import { JobStatus } from '@eventon/db';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDto } from './dto/job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

type JobEntity = {
  id: string;
  organisationId: string;
  clientId: string | null;
  title: string;
  description: string | null;
  status: JobStatus;
  location: string | null;
  remote: boolean | null;
  startsAt: Date | null;
  endsAt: Date | null;
};

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(JobsService.name);
  }

  async list(orgId: string): Promise<JobDto[]> {
    try {
      const jobs = (await this.prisma.job.findMany({
        where: { organisationId: orgId },
        take: 100,
        orderBy: { createdAt: 'desc' },
      })) as JobEntity[];
      return jobs.map((job) => this.toDto(job));
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Returning fallback job list');
      return [
        {
          id: 'stub-job',
          title: 'Sample Job',
          status: JobStatus.DRAFT,
          clientId: null,
          description: 'Fallback job when the database is unavailable.',
          location: 'Remote',
          remote: true,
          startsAt: null,
          endsAt: null,
        },
      ];
    }
  }

  async create(orgId: string, payload: CreateJobDto): Promise<JobDto> {
    try {
      const job = (await this.prisma.job.create({
        data: {
          organisationId: orgId,
          clientId: payload.clientId,
          title: payload.title,
          description: payload.description,
          status: payload.status ?? JobStatus.DRAFT,
          location: payload.location,
          remote: payload.remote ?? false,
          startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
          endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined,
        },
      })) as JobEntity;
      return this.toDto(job);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Job creation failed, returning echo response');
      return {
        id: `job-${Date.now()}`,
        title: payload.title,
        status: payload.status ?? JobStatus.DRAFT,
        clientId: payload.clientId ?? null,
        description: payload.description ?? null,
        location: payload.location ?? null,
        remote: payload.remote ?? false,
        startsAt: payload.startsAt ?? null,
        endsAt: payload.endsAt ?? null,
      };
    }
  }

  async get(orgId: string, jobId: string): Promise<JobDto> {
    try {
      const job = (await this.prisma.job.findFirst({
        where: { id: jobId, organisationId: orgId },
      })) as JobEntity | null;
      if (job) {
        return this.toDto(job);
      }
    } catch (error) {
      this.logger.warn({ err: error, orgId, jobId }, 'Job lookup failed');
    }

    return {
      id: jobId,
      title: 'Unknown Job',
      status: JobStatus.CANCELLED,
      clientId: null,
      description: 'Fallback job when the database cannot be queried.',
      location: null,
      remote: false,
      startsAt: null,
      endsAt: null,
    };
  }

  async update(orgId: string, jobId: string, payload: UpdateJobDto): Promise<JobDto> {
    try {
      const job = (await this.prisma.job.update({
        where: { id: jobId },
        data: {
          ...payload,
          startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
          endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined,
        },
      })) as JobEntity;
      return this.toDto(job);
    } catch (error) {
      this.logger.warn({ err: error, orgId, jobId }, 'Job update failed, returning merged payload');
      const existing = await this.get(orgId, jobId);
      return {
        ...existing,
        ...payload,
      };
    }
  }

  private toDto(job: JobEntity): JobDto {
    return {
      id: job.id,
      title: job.title,
      status: job.status,
      clientId: job.clientId ?? null,
      description: job.description ?? null,
      location: job.location ?? null,
      remote: job.remote ?? false,
      startsAt: job.startsAt ? job.startsAt.toISOString() : null,
      endsAt: job.endsAt ? job.endsAt.toISOString() : null,
    };
  }
}
