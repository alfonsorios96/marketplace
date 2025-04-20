import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesListener } from '../invoices.listener';
import { InvoicesService } from '../invoices.service';

describe('InvoicesListener', () => {
  let listener: InvoicesListener;
  let service: InvoicesService;

  const mockInvoicesService = {
    markInvoiceAsSent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesListener,
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
      ],
    }).compile();

    listener = module.get<InvoicesListener>(InvoicesListener);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should call markInvoiceAsSent with the correct order_id', async () => {
    const message = { order_id: 'order_123' };

    await listener.handleOrderShipped(message);

    expect(service.markInvoiceAsSent).toHaveBeenCalledTimes(1);
    expect(service.markInvoiceAsSent).toHaveBeenCalledWith('order_123');
  });
});
