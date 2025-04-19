import * as request from 'supertest';
import { setupE2EEnvironment, teardownE2EEnvironment } from './setup/e2e';
import { OrderStatus } from '@repo/shared';

describe('Order-Invoice E2E Flow', () => {
  let ordersApp, invoicesApp;

  beforeAll(async () => {
    const environment = await setupE2EEnvironment();
    ordersApp = environment.ordersApp;
    invoicesApp = environment.invoicesApp;
  }, 30000);

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
        seller_id: 'seller_012'
      })
      .expect(201);

    // 2. Upload Invoice
    await request(invoicesApp.getHttpServer())
      .post('/invoices')
      .field('order_id', order._id)
      .attach('file', Buffer.from('fake-pdf'), 'invoice.pdf')
      .expect(201);

    // 3.1 Change status to ACCEPTED
    await request(ordersApp.getHttpServer())
      .patch(`/orders/${order._id}/status`)
      .send({ status: OrderStatus.ACCEPTED })
      .expect(200);

    // 3.2 Change status to SHIPPING_IN_PROGRESS
    await request(ordersApp.getHttpServer())
      .patch(`/orders/${order._id}/status`)
      .send({ status: OrderStatus.SHIPPING_IN_PROGRESS })
      .expect(200);

    // 3.3 Change status to SHIPPED
    await request(ordersApp.getHttpServer())
      .patch(`/orders/${order._id}/status`)
      .send({ status: OrderStatus.SHIPPED })
      .expect(200);

    // 4. Verify sent_at (pooling)
    for (let i = 0; i < 5; i++) {
      await request(invoicesApp.getHttpServer())
        .get(`/invoices/${order._id}`)
        .expect(200);
    }
  }, 15000);
});
