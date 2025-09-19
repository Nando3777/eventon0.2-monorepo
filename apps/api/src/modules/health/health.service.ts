import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService?: ConfigService,
    private readonly logger?: PinoLogger,
  ) {
    this.logger?.setContext?.(HealthService.name);
  }

  async check(): Promise<HealthResponseDto> {
    const response = new HealthResponseDto();

    const dbUrl =
      this.configService?.get<string>('DATABASE_URL') ?? process.env.DATABASE_URL;

    // Prefer the injected PrismaService (which should be connected); fallback to short-lived client only if necessary.
    const client: PrismaClient = (this.prisma as PrismaClient) ?? new PrismaClient(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined);

    let localClientCreated = false;
    if (client === this.prisma) {
      // using injected client
    } else {
      localClientCreated = true;
    }

    try {
      await client.$connect();

      // explicit non-template probe
      // @ts-expect-error runtime call
      const result = await (client as any).$queryRawUnsafe?.('SELECT 1') ??
        // fallback to tagged template
        // @ts-expect-error
        await (client as any).$queryRaw`SELECT 1`;

      this.logger?.debug?.({ result }, 'Database health probe result');

      response.database = true;
      response.status = 'ok';
    } catch (error) {
      this.logger?.warn?.({ err: error }, 'Database health check failed');
//Keep error logging so you can see failures in dev logs
//eslint-disable-next-line no-console
      console.error('HealthService: DB probe error:', (error as Error)?.message ?? error);
      response.status = 'degraded';
      response.database = false;
    } finally {
      if (localClientCreated) {
        try {
          await (client as PrismaClient).$disconnect();
        } catch {
          // ignore
        }
      }
    }

    return response;
  }
}
