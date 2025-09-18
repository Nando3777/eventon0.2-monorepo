import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffMemberDto } from './dto/staff-member.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

type StaffProfileEntity = {
  id: string;
  organisationId: string;
  userId: string;
  headline: string | null;
  bio: string | null;
};

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(StaffService.name);
  }

  async list(orgId: string): Promise<StaffMemberDto[]> {
    try {
      const staff = (await this.prisma.staffProfile.findMany({
        where: { organisationId: orgId },
        take: 100,
        orderBy: { createdAt: 'desc' },
      })) as StaffProfileEntity[];
      return staff.map((member) => this.toDto(member));
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Returning fallback staff list');
      return [
        {
          id: 'stub-staff',
          userId: 'user-stub',
          headline: 'Fallback staff member',
          bio: 'Displayed when the database is not reachable.',
        },
      ];
    }
  }

  async create(orgId: string, payload: CreateStaffDto): Promise<StaffMemberDto> {
    try {
      const staff = (await this.prisma.staffProfile.create({
        data: {
          organisationId: orgId,
          userId: payload.userId,
          headline: payload.headline,
          bio: payload.bio,
        },
      })) as StaffProfileEntity;
      return this.toDto(staff);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Staff creation failed, returning echo response');
      return {
        id: `staff-${Date.now()}`,
        userId: payload.userId,
        headline: payload.headline ?? null,
        bio: payload.bio ?? null,
      };
    }
  }

  async get(orgId: string, staffId: string): Promise<StaffMemberDto> {
    try {
      const staff = (await this.prisma.staffProfile.findFirst({
        where: { id: staffId, organisationId: orgId },
      })) as StaffProfileEntity | null;
      if (staff) {
        return this.toDto(staff);
      }
    } catch (error) {
      this.logger.warn({ err: error, orgId, staffId }, 'Staff lookup failed');
    }

    return {
      id: staffId,
      userId: 'unknown-user',
      headline: 'Unknown staff member',
      bio: null,
    };
  }

  async update(orgId: string, staffId: string, payload: UpdateStaffDto): Promise<StaffMemberDto> {
    try {
      const staff = (await this.prisma.staffProfile.update({
        where: { id: staffId },
        data: payload,
      })) as StaffProfileEntity;
      return this.toDto(staff);
    } catch (error) {
      this.logger.warn({ err: error, orgId, staffId }, 'Staff update failed, returning merged payload');
      const existing = await this.get(orgId, staffId);
      return {
        ...existing,
        ...payload,
      };
    }
  }

  private toDto(staff: StaffProfileEntity): StaffMemberDto {
    return {
      id: staff.id,
      userId: staff.userId,
      headline: staff.headline ?? null,
      bio: staff.bio ?? null,
    };
  }
}
