import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdersService } from '../orders.service';
import { Order, OrderStatus, CreateOrderDto } from '@repo/shared';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';


describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: Model<Order>;

  const mockOrder = {
    _id: 'order_123',
    status: OrderStatus.SHIPPING_IN_PROGRESS,
    product_id: 'prod_456',
    price: 299.99,
    quantity: 2,
    customer_id: 'cust_789',
    seller_id: 'seller_012',
  };

  const mockSave = jest.fn().mockResolvedValue({
    ...mockOrder,
    status: OrderStatus.CREATED,
  });

  const mockOrderModel = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  (mockOrderModel as any).find = jest.fn().mockResolvedValue([mockOrder]);
  (mockOrderModel as any).findById = jest.fn().mockResolvedValue(mockOrder);
  (mockOrderModel as any).findByIdAndUpdate = jest.fn().mockResolvedValue(mockOrder);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
  });

  describe('create()', () => {
    it('should create an order with status CREATED', async () => {
      const dto: CreateOrderDto = {
        product_id: 'prod_456',
        price: 299.99,
        quantity: 2,
        customer_id: 'cust_789',
        seller_id: 'seller_012',
      };

      const result = await service.create(dto);
      expect(result.status).toBe(OrderStatus.CREATED);
      expect(result).toEqual({...mockOrder, status: 'CREATED'});
    });
  });

  describe('findAll()', () => {
    it('should filter orders by seller_id y status', async () => {
      const sellerId = 'seller_012';
      const status = OrderStatus.CREATED;

      await service.findAll(sellerId, status);
      expect(orderModel.find).toHaveBeenCalledWith({
        seller_id: sellerId,
        status: status,
      });
    });
  });

  describe('updateStatus()', () => {
    it('should reject an invalid transition SHIPPING_IN_PROGRESS → ACCEPTED', async () => {
      await expect(
          service.updateStatus('order_123', OrderStatus.ACCEPTED)
      ).rejects.toThrow('Cannot change status from SHIPPING_IN_PROGRESS to ACCEPTED');
    });
  });
});
