import { Global, Module } from '@nestjs/common';
import { OrgRoleGuard } from './guards/org-role.guard';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, OrgRoleGuard],
  exports: [PrismaService, OrgRoleGuard],
})
export class CommonModule {}
