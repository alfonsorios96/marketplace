import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from '@repo/shared';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, {
    provide: 'ORDER_EMITTER',
    useFactory: (): ClientProxy => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@localhost:5672`],
          queue: 'order_shipped_queue',
          queueOptions: {
            durable: true,
          },
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
          },
        },
      });
    },
  }],
})
export class OrdersModule {}
