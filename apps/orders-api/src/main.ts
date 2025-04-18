import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RmqOptions } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { rabbitMQConfig } from "./rabbitmq.options";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  const externalSwaggerDoc = load(
    readFileSync(
      join(__dirname, '../../../packages/shared/swagger/orders-api.yaml'),
      'utf8',
    ),
  ) as Record<string, any>;

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const mergedDocument = {
    ...document,
    ...externalSwaggerDoc,
    paths: { ...document.paths, ...externalSwaggerDoc.paths },
    components: { ...document.components, ...externalSwaggerDoc.components },
  };

  SwaggerModule.setup('api', app, mergedDocument, {
    customSiteTitle: 'Orders API Documentation',
    explorer: true,
  });

  app.connectMicroservice<RmqOptions>(rabbitMQConfig());

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
