import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3002);
}
bootstrap();
