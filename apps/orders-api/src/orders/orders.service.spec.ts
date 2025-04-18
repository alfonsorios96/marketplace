import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './order.schema';
import { CreateOrderDto } from './create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderModel: Model<Order>;
  let clientProxy: ClientProxy;

  const mockOrder = {
    _id: 'order_123',
    status: OrderStatus.SHIPPING_IN_PROGRESS,
    product_id: 'prod_456',
    price: 299.99,
    quantity: 2,
    customer_id: 'cust_789',
    seller_id: 'seller_012',
  };

  class MockOrderModel {
    constructor() {};
    save = jest.fn().mockResolvedValue({...mockOrder, status: OrderStatus.CREATED});
    static find = jest.fn().mockResolvedValue([mockOrder]);
    static findById = jest.fn().mockResolvedValue(mockOrder);
    static findByIdAndUpdate = jest.fn().mockResolvedValue(mockOrder);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: MockOrderModel,
        },
        {
          provide: 'ORDER_EMITTER',
          useValue: {
            emit: jest.fn().mockReturnValue({
              pipe: jest.fn().mockReturnThis(),
              subscribe: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
    clientProxy = module.get<ClientProxy>('ORDER_EMITTER');
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
      ).rejects.toThrow('Invalid status transition');
    });
  });

  describe('publish()', () => {
    it('should handler errors on emit', async () => {
      const error = new Error('RabbitMQ error');
      jest.spyOn(clientProxy, 'emit').mockImplementationOnce(() => {
        throw error;
      });

      await expect(
          service.updateStatus('order_123', OrderStatus.SHIPPED)
      ).rejects.toThrow(error.message);
    });
  });
});
