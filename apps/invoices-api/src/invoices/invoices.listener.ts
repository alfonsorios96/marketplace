import { Injectable, Logger } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class InvoicesListener {
    private readonly logger = new Logger(InvoicesListener.name);

    constructor(private readonly invoicesService: InvoicesService) {
        this.logger.log('📡 InvoicesListener initialized');
    }

    @RabbitSubscribe({
        exchange: 'orders_exchange',
        routingKey: 'order.shipped',
        queue: 'order_shipped_queue',
    })
    async handleOrderShipped(message: { order_id: string }) {
        this.logger.log(`📦 order.shipped received: ${JSON.stringify(message)}`);
        await this.invoicesService.markInvoiceAsSent(message.order_id);
    }
}
