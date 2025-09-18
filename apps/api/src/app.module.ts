import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'node:path';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { HealthModule } from './modules/health/health.module';
import { InvitesModule } from './modules/invites/invites.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { MatchingModule } from './modules/matching/matching.module';
import { OrgsModule } from './modules/orgs/orgs.module';
import { PrivacyModule } from './modules/privacy/privacy.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ResponsesModule } from './modules/responses/responses.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), '.env')],
      cache: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('LOG_LEVEL', 'info'),
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'req.body.password',
              'req.body.token',
              'res.headers["set-cookie"]',
            ],
            censor: '***',
          },
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: Number(configService.get('RATE_LIMIT_TTL', 60)),
          limit: Number(configService.get('RATE_LIMIT_LIMIT', 120)),
        },
      ],
    }),
    CommonModule,
    AuthModule,
    OrgsModule,
    ClientsModule,
    StaffModule,
    JobsModule,
    ShiftsModule,
    InvitesModule,
    ResponsesModule,
    ReportsModule,
    MatchingModule,
    PrivacyModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
