import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesListener } from "./invoices.listener";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  controllers: [InvoicesController, InvoicesListener],
  providers: [InvoicesService],
})
export class InvoicesModule {}
