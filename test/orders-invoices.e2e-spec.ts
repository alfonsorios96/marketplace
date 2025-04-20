import * as request from 'supertest';
import { setupE2EEnvironment, teardownE2EEnvironment } from './setup/e2e';
import { OrderStatus } from '@repo/shared';

describe('Order-Invoice E2E Flow', () => {
  let ordersApp, invoicesApp;

  beforeAll(async () => {
    const environment = await setupE2EEnvironment();
    ordersApp = environment.ordersApp;
    invoicesApp = environment.invoicesApp;
  }, 15000);

  afterAll(async () => {
    await teardownE2EEnvironment();
  });

  it('happy path', async () => {
    // 1. Create order
    const { body: order } = await request(ordersApp.getHttpServer())
      .post('/orders')
      .send({
        product_id: 'prod_123',
        price: 299.99,
        quantity: 2,
        customer_id: 'cust_789',
        seller_id: 'seller_012',
      })
      .expect(201);

    // 2. Create invoice related to order
    await request(invoicesApp.getHttpServer())
      .post('/invoices')
      .field('order_id', order._id)
      .attach('file', Buffer.from('fake-pdf'), 'invoice.pdf')
      .expect(201);

    // 3. Change status CREATED -> ACCEPTED
    await request(ordersApp.getHttpServer())
      .patch(`/orders/${order._id}/status`)
      .send({ status: OrderStatus.ACCEPTED })
      .expect(200);

    // 3. Change status ACCEPTED -> SHIPPING_IN_PROGRESS
    await request(ordersApp.getHttpServer())
      .patch(`/orders/${order._id}/status`)
      .send({ status: OrderStatus.SHIPPING_IN_PROGRESS })
      .expect(200);

    // 4. Change status SHIPPING_IN_PROGRESS -> SHIPPED
    await request(ordersApp.getHttpServer())
      .patch(`/orders/${order._id}/status`)
      .send({ status: OrderStatus.SHIPPED })
      .expect(200);
  }, 15000);
  it('rejection path', async () => {
    // 1. Create order
    const { body: order } = await request(ordersApp.getHttpServer())
      .post('/orders')
      .send({
        product_id: 'prod_123',
        price: 299.99,
        quantity: 2,
        customer_id: 'cust_789',
        seller_id: 'seller_012',
      })
      .expect(201);

    // 2. Create invoice related to order
    await request(invoicesApp.getHttpServer())
      .post('/invoices')
      .field('order_id', order._id)
      .attach('file', Buffer.from('fake-pdf'), 'invoice.pdf')
      .expect(201);

    // 3. Change status CREATED -> REJECTED
    await request(ordersApp.getHttpServer())
      .patch(`/orders/${order._id}/status`)
      .send({ status: OrderStatus.REJECTED })
      .expect(200);
  }, 15000);
});
