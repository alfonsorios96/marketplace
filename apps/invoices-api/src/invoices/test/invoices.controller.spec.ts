import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from '../invoices.controller';
import { InvoicesService } from '../invoices.service';
import { UploadInvoiceDto } from '@repo/shared';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

describe('InvoicesController', () => {
    let controller: InvoicesController;
    let service: InvoicesService;

    const mockFile = {
        originalname: 'invoice.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from(''),
    } as Express.Multer.File;

    const mockInvoice = {
        order_id: 'order_123',
        file: mockFile,
        sent_at: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InvoicesController],
            providers: [
                {
                    provide: InvoicesService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(mockInvoice),
                        findByOrder: jest.fn().mockResolvedValue(mockInvoice),
                    },
                },
            ],
        })
            .overrideInterceptor(FileInterceptor)
            .useValue({
                intercept: jest.fn().mockImplementation((req, res, next) => next()),
            })
            .compile();

        controller = module.get<InvoicesController>(InvoicesController);
        service = module.get<InvoicesService>(InvoicesService);
    });

    describe('POST /invoices', () => {
        it('should upload a PDF invoice and returns metadata', async () => {
            const dto: UploadInvoiceDto = { order_id: 'order_123', file: null };

            const result = await controller.uploadInvoice(mockFile, dto);

            expect(service.create).toHaveBeenCalledWith({
                order_id: dto.order_id,
                file: mockFile,
            });
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('GET /invoices/:orderId', () => {
        it('should returns the invoices related to an order', async () => {
            const orderId = 'order_123';

            const result = await controller.getByOrder(orderId);

            expect(service.findByOrder).toHaveBeenCalledWith(orderId);
            expect(result).toEqual(mockInvoice);
        });

        it('should handler an order without invoice', async () => {
            jest.spyOn(service, 'findByOrder').mockResolvedValueOnce(null);
            const orderId = 'order_999';

            await expect(controller.getByOrder(orderId)).resolves.toBeNull();
        });
    });
});
