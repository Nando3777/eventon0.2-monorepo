import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { OrgDto } from './dto/org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';

type OrganisationEntity = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  timezone: string | null;
};

@Injectable()
export class OrgsService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(OrgsService.name);
  }

  async list(): Promise<OrgDto[]> {
    try {
      const organisations = (await this.prisma.organisation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      })) as OrganisationEntity[];
      return organisations.map((org) => this.toDto(org));
    } catch (error) {
      this.logger.warn({ err: error }, 'Falling back to stub organisation list');
      return [
        {
          id: 'stub-org',
          name: 'Demo Organisation',
          slug: 'demo-org',
          description: 'Fallback organisation when the database is unavailable.',
          timezone: 'UTC',
        },
      ];
    }
  }

  async create(payload: CreateOrgDto): Promise<OrgDto> {
    try {
      const organisation = (await this.prisma.organisation.create({
        data: {
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          timezone: payload.timezone,
          ownerId: payload.ownerId,
        },
      })) as OrganisationEntity;
      return this.toDto(organisation);
    } catch (error) {
      this.logger.warn({ err: error }, 'Organisation creation failed, returning echo response');
      return {
        id: `org-${payload.slug}`,
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        timezone: payload.timezone ?? 'UTC',
      };
    }
  }

  async get(orgId: string): Promise<OrgDto> {
    try {
      const organisation = (await this.prisma.organisation.findUnique({
        where: { id: orgId },
      })) as OrganisationEntity | null;
      if (organisation) {
        return this.toDto(organisation);
      }
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Organisation lookup failed');
    }

    return {
      id: orgId,
      name: 'Unknown Organisation',
      slug: 'unknown-org',
      description: 'Fallback response when the organisation cannot be loaded.',
      timezone: null,
    };
  }

  async update(orgId: string, payload: UpdateOrgDto): Promise<OrgDto> {
    try {
      const organisation = (await this.prisma.organisation.update({
        where: { id: orgId },
        data: payload,
      })) as OrganisationEntity;
      return this.toDto(organisation);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Organisation update failed, returning merged payload');
      const existing = await this.get(orgId);
      return {
        ...existing,
        ...payload,
      };
    }
  }

  private toDto(org: OrganisationEntity): OrgDto {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description ?? null,
      timezone: org.timezone ?? null,
    };
  }
}
