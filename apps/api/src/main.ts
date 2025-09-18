import 'reflect-metadata';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: false });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  await app.register(helmet as unknown as Parameters<typeof app.register>[0], {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  const origins = (configService.get<string>('CORS_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  await app.register(cors as unknown as Parameters<typeof app.register>[0], {
    credentials: true,
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
      if (!origin || origins.length === 0 || origins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS policy'), false);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Eventon API')
    .setDescription('Eventon platform API documentation')
    .setVersion('0.2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = Number(configService.get('PORT', 4000));
  const host = configService.get<string>('HOST', '0.0.0.0');
  await app.listen({ port, host });

  logger.log(`API listening on http://${host}:${port}`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('API bootstrap failed', error);
  process.exit(1);
});
