import { Injectable, Logger } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { OrderEvents, OrderExchanges, OrderQueus } from '@repo/shared';

@Injectable()
export class InvoicesListener {
    private readonly logger = new Logger(InvoicesListener.name);

    constructor(private readonly invoicesService: InvoicesService) {
        this.logger.log('📡 InvoicesListener initialized');
    }

    @RabbitSubscribe({
        exchange: OrderExchanges.DEFAULT,
        routingKey: OrderEvents.SHIPPED,
        queue: OrderQueus.SHIPPED,
    })
    async handleOrderShipped(message: { order_id: string }) {
        this.logger.log(`📦 ${OrderEvents.SHIPPED} received: ${JSON.stringify(message)}`);
        await this.invoicesService.markInvoiceAsSent(message.order_id);
    }
}
