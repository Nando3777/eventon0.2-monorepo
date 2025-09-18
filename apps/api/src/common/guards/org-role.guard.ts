import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrgRole } from '@eventon/db';
import { FastifyRequest } from 'fastify';
import { PinoLogger } from 'nestjs-pino';
import { ORG_ROLES_KEY } from '../decorators/org-roles.decorator';

type OrgScopedRequest = FastifyRequest<{ Params: { orgId?: string } } & Record<string, unknown>> & {
  user?: {
    orgId?: string;
    role?: OrgRole;
  };
  orgContext?: {
    orgId: string;
    role?: OrgRole;
  };
};

@Injectable()
export class OrgRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly logger: PinoLogger) {
    this.logger.setContext(OrgRoleGuard.name);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<OrgScopedRequest>();
    const paramsOrgId = request.params?.orgId;
    const headerOrgId = this.getHeaderValue(request, 'x-org-id');
    const orgId = paramsOrgId ?? headerOrgId;

    if (!orgId) {
      this.logger.warn('Organisation scope missing from request');
      throw new ForbiddenException('Organisation scope is required for this route.');
    }

    const requiredRoles =
      this.reflector.getAllAndOverride<OrgRole[]>(ORG_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const headerRole = this.getHeaderValue(request, 'x-org-role');
    const userRole = request.user?.role;
    const candidateRole = (headerRole ?? userRole)?.toUpperCase() as OrgRole | undefined;

    request.orgContext = {
      orgId,
      role: candidateRole,
    };

    if (requiredRoles.length === 0) {
      return true;
    }

    if (!candidateRole) {
      this.logger.warn('Organisation role missing from request headers');
      throw new ForbiddenException('Organisation role header is required.');
    }

    if (!requiredRoles.includes(candidateRole)) {
      this.logger.warn({ requiredRoles, candidateRole }, 'Organisation role not permitted');
      throw new ForbiddenException('Insufficient organisation role for this resource.');
    }

    return true;
  }

  private getHeaderValue(request: OrgScopedRequest, header: string): string | undefined {
    const value = request.headers?.[header] ?? request.headers?.[header.toLowerCase()];
    if (Array.isArray(value)) {
      return value[0];
    }
    if (typeof value === 'string') {
      return value;
    }
    return undefined;
  }
}
