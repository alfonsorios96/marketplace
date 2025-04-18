import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';

@Controller()
export class InvoicesListener {
    constructor(private invoicesService: InvoicesService) {}

    @EventPattern('order.shipped')
    async handleOrderShipped(data: { order_id: string }) {
        await this.invoicesService.markInvoiceAsSent(data.order_id);
    }
}
