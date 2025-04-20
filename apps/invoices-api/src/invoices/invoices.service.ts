import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Express } from 'express';
import { Invoice, InvoiceDocument } from '@repo/shared';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create({
     order_id,
     file,
   }: {
    order_id: string;
    file: Express.Multer.File;
  }): Promise<Invoice> {
    if (!order_id || typeof order_id !== 'string') {
      throw new BadRequestException('order_id must be a non‑empty string');
    }
    if (!file) {
      throw new BadRequestException('Invoice PDF file must be provided');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        `Invalid file type ${file.mimetype}; only PDF allowed`,
      );
    }

    const newInvoice = new this.invoiceModel({
      order_id,
      file_path: `/invoices/${file.filename}`,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const saved = await newInvoice.save();
    this.logger.log(
      `🧾 Invoice created for order ${order_id}: ${saved._id}`,
    );
    return saved;
  }

  async findByOrder(orderId: string): Promise<Invoice> {
    if (!orderId || typeof orderId !== 'string') {
      throw new BadRequestException('orderId must be a non‑empty string');
    }

    const invoice = await this.invoiceModel
      .findOne({ order_id: orderId });

    if (!invoice) {
      this.logger.warn(`Invoice not found for order ${orderId}`);
      throw new NotFoundException(
        `Invoice not found for orderId=${orderId}`,
      );
    }

    return invoice;
  }

  async markInvoiceAsSent(orderId: string): Promise<Invoice> {
    if (!orderId || typeof orderId !== 'string') {
      throw new BadRequestException('orderId must be a non‑empty string');
    }

    const updated = await this.invoiceModel
      .findOneAndUpdate(
        { order_id: orderId },
        { sent_at: new Date() },
        { new: true },
      );

    if (!updated) {
      this.logger.warn(`Cannot mark as sent; no invoice for order ${orderId}`);
      throw new NotFoundException(
        `Cannot mark as sent; invoice not found for orderId=${orderId}`,
      );
    }

    this.logger.log(`✅ Invoice for order ${orderId} marked as sent`);
    return updated;
  }
}
