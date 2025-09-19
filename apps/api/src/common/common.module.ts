import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrgRoleGuard } from './guards/org-role.guard';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService, OrgRoleGuard],
  exports: [PrismaService, OrgRoleGuard],
})
export class CommonModule {}
