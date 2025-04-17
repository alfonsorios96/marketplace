var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
let InvoicesService = class InvoicesService {
    constructor(invoiceModel) {
        this.invoiceModel = invoiceModel;
    }
    async create({ order_id, file, }) {
        const newInvoice = new this.invoiceModel({
            order_id,
            file_path: `/invoices/${file.filename}`,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        });
        return newInvoice.save();
    }
    async findByOrder(orderId) {
        return this.invoiceModel.findOne({ order_id: orderId }).exec();
    }
};
InvoicesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Invoice.name)),
    __metadata("design:paramtypes", [Model])
], InvoicesService);
export { InvoicesService };
