import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoicesService } from '../invoices.service';
import { Invoice } from '@repo/shared';
import { Express } from 'express';

describe('InvoicesService', () => {
    let service: InvoicesService;
    let invoiceModel: Model<Invoice>;

    const mockFile = {
        filename: 'invoice_123.pdf',
        originalname: 'invoice.pdf',
        mimetype: 'application/pdf',
        size: 1024,
    } as Express.Multer.File;

    const mockInvoice = {
        order_id: 'order_123',
        file_path: '/invoices/invoice_123.pdf',
        originalname: 'invoice.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        sent_at: new Date(),
    };

    class MockInvoiceModel {
        constructor() {};
        save = jest.fn().mockResolvedValue(mockInvoice);
        static findOne = jest.fn().mockResolvedValue(mockInvoice);
        static findOneAndUpdate = jest.fn().mockResolvedValue(mockInvoice);
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoicesService,
                {
                    provide: getModelToken(Invoice.name),
                    useValue: MockInvoiceModel,
                },
            ],
        }).compile();

        service = module.get<InvoicesService>(InvoicesService);
        invoiceModel = module.get<Model<Invoice>>(getModelToken(Invoice.name));
    });

    describe('create()', () => {
        it('should create an invoice with file metadata', async () => {
            const result = await service.create({
                order_id: 'order_123',
                file: mockFile,
            });
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('findByOrder()', () => {
        it('should find invoice by order_id', async () => {
            const result = await service.findByOrder('order_123');
            expect(invoiceModel.findOne).toHaveBeenCalledWith({ order_id: 'order_123' });
            expect(result).toEqual(mockInvoice);
        });

        it('should get null if not exist', async () => {
            jest.spyOn(invoiceModel, 'findOne').mockResolvedValueOnce(null);
            const result = await service.findByOrder('order_999');
            expect(result).toBeNull();
        });
    });

    describe('markInvoiceAsSent()', () => {
        it('should update sent_at with current timestamp', async () => {
            const result = await service.markInvoiceAsSent('order_123');
            expect(invoiceModel.findOneAndUpdate).toHaveBeenCalledWith(
                { order_id: 'order_123' },
                { sent_at: expect.any(Date) },
                { new: true }
            );
            expect(result.sent_at).toBeInstanceOf(Date);
        });
    });
});
