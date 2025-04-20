import { MongoMemoryServer } from 'mongodb-memory-server';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { OrdersModule } from 'orders-api/dist/orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from 'invoices-api/dist/src/invoices/invoices.module';

let mongoServer: MongoMemoryServer;
let ordersApp: INestApplication;
let invoicesApp: INestApplication;

export async function setupE2EEnvironment(): Promise<{ordersApp: INestApplication; invoicesApp: INestApplication}> {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      downloadDir: '/tmp/e2e-mongodb',
      systemBinary: undefined,
    },
    instance: {
      dbName: 'orders_test'
    },
  });
  const mongoUri = mongoServer.getUri();

  return await startMicroservices(mongoUri);
}

async function startMicroservices(mongoUri: string) {
  const ordersModule = await Test.createTestingModule({
    imports: [
      OrdersModule,
      MongooseModule.forRoot(mongoUri, { dbName: 'orders_test' }),
    ],
  }).compile();

  ordersApp = ordersModule.createNestApplication();
  await ordersApp.init();

  const invoicesModule = await Test.createTestingModule({
    imports: [
      InvoicesModule,
      MongooseModule.forRoot(mongoUri, { dbName: 'orders_test' }),
    ],
  }).compile();

  invoicesApp = invoicesModule.createNestApplication();
  await invoicesApp.init();

  await new Promise((res) => setTimeout(res, 500));

  return {
    ordersApp,
    invoicesApp,
  };
}

export async function teardownE2EEnvironment() {
  await ordersApp.close();
  await invoicesApp.close();
  await mongoServer.stop();
}
