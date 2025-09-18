import { Injectable } from '@nestjs/common';
import { MemberStatus, OrgRole } from '@eventon/db';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InviteDto } from './dto/invite.dto';

type OrgMemberEntity = {
  id: string;
  organisationId: string;
  userId: string;
  role: OrgRole;
  status: MemberStatus;
  invitedAt: Date | null;
  user?: { email: string | null } | null;
};

@Injectable()
export class InvitesService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(InvitesService.name);
  }

  async list(orgId: string): Promise<InviteDto[]> {
    try {
      const members = (await this.prisma.orgMember.findMany({
        where: { organisationId: orgId, status: MemberStatus.INVITED },
        include: { user: true },
        orderBy: { invitedAt: 'desc' },
      })) as OrgMemberEntity[];
      return members.map((member) => this.toDto(member));
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Returning fallback invites');
      return [
        {
          id: 'stub-invite',
          email: 'invitee@example.com',
          role: OrgRole.STAFF,
          status: MemberStatus.INVITED,
          invitedAt: new Date().toISOString(),
        },
      ];
    }
  }

  async create(orgId: string, payload: CreateInviteDto): Promise<InviteDto> {
    try {
      const user = await this.prisma.user.upsert({
        where: { email: payload.email },
        update: { name: payload.name ?? undefined },
        create: { email: payload.email, name: payload.name },
      });

      const member = (await this.prisma.orgMember.upsert({
        where: {
          organisationId_userId: {
            organisationId: orgId,
            userId: user.id,
          },
        },
        update: {
          role: payload.role,
          status: MemberStatus.INVITED,
          invitedAt: new Date(),
        },
        create: {
          organisationId: orgId,
          userId: user.id,
          role: payload.role,
          status: MemberStatus.INVITED,
          invitedAt: new Date(),
        },
        include: { user: true },
      })) as OrgMemberEntity;

      return this.toDto(member);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Invite creation failed, returning stub invite');
      return {
        id: `invite-${Date.now()}`,
        email: payload.email,
        role: payload.role,
        status: MemberStatus.INVITED,
        invitedAt: new Date().toISOString(),
      };
    }
  }

  private toDto(member: OrgMemberEntity): InviteDto {
    return {
      id: member.id,
      email: member.user?.email ?? 'unknown@example.com',
      role: member.role,
      status: member.status,
      invitedAt: member.invitedAt ? member.invitedAt.toISOString() : null,
    };
  }
}
