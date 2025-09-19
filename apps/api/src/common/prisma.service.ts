import { Injectable, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Optional() private readonly configService: ConfigService | null,
    @Optional() private readonly logger?: PinoLogger,
  ) {
    const databaseUrl =
      configService?.get<string>('DATABASE_URL') ?? process.env.DATABASE_URL;

    // Ensure we always call super with the same options the app would use.
    super(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined);

    this.logger?.setContext?.(PrismaService.name);
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger?.debug?.('Database connection initialised');
    } catch (error) {
      this.logger?.warn?.({ err: error }, 'Database connection failed, continuing without DB');
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
    } catch {
      // ignore disconnect errors during shutdown
    }
  }
}
