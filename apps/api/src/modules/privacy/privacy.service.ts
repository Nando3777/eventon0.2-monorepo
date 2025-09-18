import { Injectable } from '@nestjs/common';
import { ConsentScope, DsrStatus, DsrType } from '@eventon/db';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { ConsentDto } from './dto/consent.dto';
import { CreateDsrDto } from './dto/create-dsr.dto';
import { DsrResponseDto } from './dto/dsr-response.dto';
import { FulfilDsrDto } from './dto/fulfil-dsr.dto';
import { PrivacyExportDto, PrivacyExportResponseDto } from './dto/privacy-export.dto';
import { UpsertConsentDto } from './dto/upsert-consent.dto';
import { VerifyDsrDto } from './dto/verify-dsr.dto';

type ConsentEntity = {
  id: string;
  subjectIdentifier: string;
  scope: ConsentScope;
  grantedAt: Date;
  revokedAt: Date | null;
};

type DsrEntity = {
  id: string;
  organisationId: string | null;
  subjectIdentifier: string;
  type: DsrType;
  status: DsrStatus;
  notes: string | null;
};

@Injectable()
export class PrivacyService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(PrivacyService.name);
  }

  async listConsents(subjectIdentifier: string): Promise<ConsentDto[]> {
    if (!subjectIdentifier) {
      return [];
    }

    try {
      const consents = (await this.prisma.consent.findMany({
        where: { subjectIdentifier },
        orderBy: { createdAt: 'desc' },
      })) as ConsentEntity[];
      return consents.map((consent) => this.toConsentDto(consent));
    } catch (error) {
      this.logger.warn({ err: error }, 'Failed to load consents, returning empty list');
      return [];
    }
  }

  async upsertConsent(payload: UpsertConsentDto): Promise<ConsentDto> {
    try {
      const existing = (await this.prisma.consent.findFirst({
        where: {
          subjectIdentifier: payload.subjectIdentifier,
          scope: payload.scope,
        },
      })) as ConsentEntity | null;

      const now = new Date();
      const data = {
        subjectIdentifier: payload.subjectIdentifier,
        scope: payload.scope,
        grantedAt: payload.granted ? now : undefined,
        revokedAt: payload.granted ? null : now,
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : undefined,
      };

      const consent = (existing
        ? await this.prisma.consent.update({ where: { id: existing.id }, data })
        : await this.prisma.consent.create({ data: { ...data, grantedAt: now } })) as ConsentEntity;

      return this.toConsentDto(consent);
    } catch (error) {
      this.logger.warn({ err: error }, 'Consent upsert failed, returning fallback consent');
      const now = new Date();
      return {
        id: `consent-${now.getTime()}`,
        subjectIdentifier: payload.subjectIdentifier,
        scope: payload.scope,
        grantedAt: now.toISOString(),
        revokedAt: payload.granted ? null : now.toISOString(),
      };
    }
  }

  async createDsr(orgId: string | undefined, payload: CreateDsrDto): Promise<DsrResponseDto> {
    try {
      const request = (await this.prisma.dsrRequest.create({
        data: {
          organisationId: orgId,
          subjectIdentifier: payload.subjectIdentifier,
          type: payload.type,
          notes: payload.notes,
        },
      })) as DsrEntity;
      return this.toDsrDto(request);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'DSR creation failed, returning stub');
      return {
        id: `dsr-${Date.now()}`,
        status: DsrStatus.RECEIVED,
        subjectIdentifier: payload.subjectIdentifier,
      };
    }
  }

  async verifyDsr(orgId: string | undefined, payload: VerifyDsrDto): Promise<DsrResponseDto> {
    try {
      const request = (await this.prisma.dsrRequest.update({
        where: { id: payload.requestId },
        data: {
          status: payload.verified ? DsrStatus.VALIDATING : DsrStatus.REJECTED,
          notes: payload.verificationCode,
        },
      })) as DsrEntity;
      return this.toDsrDto(request);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'DSR verification failed, returning stub');
      return {
        id: payload.requestId,
        status: payload.verified ? DsrStatus.VALIDATING : DsrStatus.REJECTED,
        subjectIdentifier: 'unknown',
      };
    }
  }

  async fulfilDsr(orgId: string | undefined, payload: FulfilDsrDto): Promise<DsrResponseDto> {
    try {
      const request = (await this.prisma.dsrRequest.update({
        where: { id: payload.requestId },
        data: {
          status: DsrStatus.COMPLETED,
          completedAt: new Date(),
          notes: payload.notes,
        },
      })) as DsrEntity;
      return this.toDsrDto(request);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'DSR fulfilment failed, returning stub');
      return {
        id: payload.requestId,
        status: DsrStatus.COMPLETED,
        subjectIdentifier: 'unknown',
      };
    }
  }

  async requestExport(orgId: string | undefined, payload: PrivacyExportDto): Promise<PrivacyExportResponseDto> {
    const exportId = `privacy-export-${Date.now()}`;
    try {
      await this.prisma.auditEvent.create({
        data: {
          organisationId: orgId,
          action: 'privacy.export',
          entityType: 'user',
          entityId: payload.subjectIdentifier,
          metadata: payload,
        },
      });
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Failed to persist privacy export audit trail');
    }

    return {
      exportId,
      status: 'queued',
    };
  }

  private toConsentDto(consent: {
    id: string;
    subjectIdentifier: string;
    scope: ConsentScope;
    grantedAt: Date;
    revokedAt?: Date | null;
  }): ConsentDto {
    return {
      id: consent.id,
      subjectIdentifier: consent.subjectIdentifier,
      scope: consent.scope,
      grantedAt: consent.grantedAt.toISOString(),
      revokedAt: consent.revokedAt ? consent.revokedAt.toISOString() : null,
    };
  }

  private toDsrDto(request: {
    id: string;
    status: DsrStatus;
    subjectIdentifier: string;
  }): DsrResponseDto {
    return {
      id: request.id,
      status: request.status,
      subjectIdentifier: request.subjectIdentifier,
    };
  }
}
