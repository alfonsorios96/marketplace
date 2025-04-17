var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
let InvoicesModule = class InvoicesModule {
};
InvoicesModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
        ],
        controllers: [InvoicesController],
        providers: [InvoicesService],
    })
], InvoicesModule);
export { InvoicesModule };
