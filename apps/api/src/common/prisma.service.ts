import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@eventon/db';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService, private readonly logger: PinoLogger) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    super(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined);
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.debug('Database connection initialised');
    } catch (error) {
      this.logger.warn({ err: error }, 'Database connection failed, continuing without DB');
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
