import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672');
  const RABBITMQ_QUEUE = configService.get<string>('RABBITMQ_QUEUE', 'order_shipped_queue');
  const PORT = configService.get<number>('PORT', 3003);

  app.setGlobalPrefix('v1');

  const externalSwaggerDoc = load(
    readFileSync(
      join(__dirname, '../../../../packages/shared/swagger/invoices-api.yaml'),
      'utf8',
    ),
  ) as Record<string, any>;

  SwaggerModule.setup('api', app, externalSwaggerDoc as OpenAPIObject, {
    customSiteTitle: 'Invoices API Documentation',
    explorer: true,
  });

  await app.listen(PORT);
}
bootstrap();
