import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { RmqOptions } from '@nestjs/microservices';

import { getRabbitMQConfig } from "@repo/shared";

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3002;
  const RABBITMQ_URL = process.env.RABBITMQ_URL;
  const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE;

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  const externalSwaggerDoc = load(
    readFileSync(
      join(__dirname, '../../../packages/shared/swagger/orders-api.yaml'),
      'utf8',
    ),
  ) as Record<string, any>;

  SwaggerModule.setup('api', app, externalSwaggerDoc as OpenAPIObject, {
    customSiteTitle: 'Orders API Documentation',
    explorer: true,
  });

  app.connectMicroservice<RmqOptions>(getRabbitMQConfig(RABBITMQ_URL, RABBITMQ_QUEUE));

  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
