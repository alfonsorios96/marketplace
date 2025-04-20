import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Invoice, InvoiceSchema, OrderExchanges } from '@repo/shared';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesListener } from "./invoices.listener";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: OrderExchanges.DEFAULT,
          type: 'topic',
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: true },
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesListener],
})
export class InvoicesModule {}
