import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  const externalSwaggerDoc = load(
    readFileSync(
      join(__dirname, '../../../../packages/shared/swagger/invoices-api.yaml'),
      'utf8',
    ),
  ) as Record<string, any>;

  const config = new DocumentBuilder()
    .setTitle('Invoices API')
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
    customSiteTitle: 'Invoices API Documentation',
    explorer: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'order_shipped_queue',
      queueOptions: {
        durable: true
      }
    }
  });

  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
