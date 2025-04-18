import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Express } from 'express';
import { Invoice, InvoiceDocument } from './invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create({
    order_id,
    file,
  }: {
    order_id: string;
    file: Express.Multer.File;
  }) {
    const newInvoice = new this.invoiceModel({
      order_id,
      file_path: `/invoices/${file.filename}`,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    return newInvoice.save();
  }

  async findByOrder(orderId: string) {
    return this.invoiceModel.findOne({ order_id: orderId });
  }

  async markInvoiceAsSent(orderId: string) {
    return this.invoiceModel.findOneAndUpdate(
        { order_id: orderId },
        { sent_at: new Date() },
        { new: true }
    );
  }
}
