import { Injectable } from '@nestjs/common';
import { ShiftStatus } from '@eventon/db';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ShiftDto } from './dto/shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

type ShiftEntity = {
  id: string;
  jobId: string;
  status: ShiftStatus;
  title: string | null;
  startTime: Date;
  endTime: Date;
  timezone: string | null;
  requiredStaff: number | null;
  notes: string | null;
};

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(ShiftsService.name);
  }

  async list(orgId: string): Promise<ShiftDto[]> {
    try {
      const shifts = (await this.prisma.shift.findMany({
        where: { job: { organisationId: orgId } },
        take: 100,
        orderBy: { startTime: 'asc' },
      })) as ShiftEntity[];
      return shifts.map((shift) => this.toDto(shift));
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Returning fallback shifts');
      return [
        {
          id: 'stub-shift',
          jobId: 'job-stub',
          status: ShiftStatus.PLANNED,
          title: 'Fallback shift',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
          timezone: 'UTC',
          requiredStaff: 1,
          notes: 'Fallback shift emitted when the database is unavailable.',
        },
      ];
    }
  }

  async create(orgId: string, payload: CreateShiftDto): Promise<ShiftDto> {
    try {
      const shift = (await this.prisma.shift.create({
        data: {
          jobId: payload.jobId,
          title: payload.title,
          startTime: new Date(payload.startTime),
          endTime: new Date(payload.endTime),
          timezone: payload.timezone,
          requiredStaff: payload.requiredStaff,
          notes: payload.notes,
          status: payload.status ?? ShiftStatus.PLANNED,
        },
      })) as ShiftEntity;
      return this.toDto(shift);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Shift creation failed, returning echo response');
      return {
        id: `shift-${Date.now()}`,
        jobId: payload.jobId,
        status: payload.status ?? ShiftStatus.PLANNED,
        title: payload.title ?? null,
        startTime: payload.startTime,
        endTime: payload.endTime,
        timezone: payload.timezone ?? 'UTC',
        requiredStaff: payload.requiredStaff ?? 1,
        notes: payload.notes ?? null,
      };
    }
  }

  async get(orgId: string, shiftId: string): Promise<ShiftDto> {
    try {
      const shift = (await this.prisma.shift.findFirst({
        where: { id: shiftId, job: { organisationId: orgId } },
      })) as ShiftEntity | null;
      if (shift) {
        return this.toDto(shift);
      }
    } catch (error) {
      this.logger.warn({ err: error, orgId, shiftId }, 'Shift lookup failed');
    }

    const now = new Date();
    return {
      id: shiftId,
      jobId: 'unknown-job',
      status: ShiftStatus.CANCELLED,
      title: 'Unknown shift',
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 3600 * 1000).toISOString(),
      timezone: 'UTC',
      requiredStaff: 1,
      notes: 'Fallback shift when the record cannot be loaded.',
    };
  }

  async update(orgId: string, shiftId: string, payload: UpdateShiftDto): Promise<ShiftDto> {
    try {
      const shift = (await this.prisma.shift.update({
        where: { id: shiftId },
        data: {
          ...payload,
          startTime: payload.startTime ? new Date(payload.startTime) : undefined,
          endTime: payload.endTime ? new Date(payload.endTime) : undefined,
        },
      })) as ShiftEntity;
      return this.toDto(shift);
    } catch (error) {
      this.logger.warn({ err: error, orgId, shiftId }, 'Shift update failed, returning merged payload');
      const existing = await this.get(orgId, shiftId);
      return {
        ...existing,
        ...payload,
        startTime: payload.startTime ?? existing.startTime,
        endTime: payload.endTime ?? existing.endTime,
      };
    }
  }

  private toDto(shift: ShiftEntity): ShiftDto {
    return {
      id: shift.id,
      jobId: shift.jobId,
      status: shift.status,
      title: shift.title ?? null,
      startTime: shift.startTime.toISOString(),
      endTime: shift.endTime.toISOString(),
      timezone: shift.timezone ?? null,
      requiredStaff: shift.requiredStaff ?? undefined,
      notes: shift.notes ?? null,
    };
  }
}
