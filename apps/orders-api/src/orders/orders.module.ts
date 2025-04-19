import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Order, OrderSchema, getRabbitMQConfig } from '@repo/shared';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ClientProxy, ClientProxyFactory } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, {
    provide: 'ORDER_EMITTER',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): ClientProxy => {
      return ClientProxyFactory.create(
        getRabbitMQConfig(
          configService.get('RABBITMQ_URL'),
          configService.get('RABBITMQ_QUEUE')
        ));
    },
  }],
})
export class OrdersModule {}
