import { Test, TestingModule } from '@nestjs/testing';

import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from '@repo/shared';

describe('OrdersController', () => {
    let controller: OrdersController;
    let service: OrdersService;

    const mockOrder = {
        _id: 'order_123',
        status: OrderStatus.CREATED,
        product_id: 'prod_456',
        price: 299.99,
        quantity: 2,
        customer_id: 'cust_789',
        seller_id: 'seller_012',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                {
                    provide: OrdersService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(mockOrder),
                        findAll: jest.fn().mockResolvedValue([mockOrder]),
                        findOne: jest.fn().mockResolvedValue(mockOrder),
                        updateStatus: jest.fn().mockImplementation((id, status) => ({
                            ...mockOrder,
                            _id: id,
                            status,
                        })),
                    },
                },
            ],
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
        service = module.get<OrdersService>(OrdersService);
    });

    describe('POST /orders', () => {
        it('should create an order and returns 201', async () => {
            const dto: CreateOrderDto = {
                product_id: 'prod_456',
                price: 299.99,
                quantity: 2,
                customer_id: 'cust_789',
                seller_id: 'seller_012',
            };

            await expect(controller.create(dto)).resolves.toEqual(mockOrder);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('GET /orders', () => {
        it('should retrieve a list filtered by seller_id and status', async () => {
            const sellerId = 'seller_012';
            const status = OrderStatus.CREATED;

            await expect(controller.findAll(sellerId, status)).resolves.toEqual([mockOrder]);
            expect(service.findAll).toHaveBeenCalledWith(sellerId, status);
        });
    });

    describe('GET /orders/:id', () => {
        it('should returns details for an order by ID', async () => {
            const orderId = 'order_123';

            await expect(controller.findOne(orderId)).resolves.toEqual(mockOrder);
            expect(service.findOne).toHaveBeenCalledWith(orderId);
        });
    });

    describe('PATCH /orders/:id/status', () => {
        it('should update order status and returns a new version', async () => {
            const orderId = 'order_123';
            const dto: UpdateOrderStatusDto = { status: OrderStatus.ACCEPTED };

            await expect(controller.updateStatus(orderId, dto)).resolves.toMatchObject({
                _id: orderId,
                status: OrderStatus.ACCEPTED,
            });
            expect(service.updateStatus).toHaveBeenCalledWith(orderId, OrderStatus.ACCEPTED);
        });

        it('should handler invalid status flows', async () => {
            jest.spyOn(service, 'updateStatus').mockRejectedValueOnce(new Error('Invalid status transition'));
            const orderId = 'order_123';
            const dto: UpdateOrderStatusDto = { status: OrderStatus.REJECTED };

            await expect(controller.updateStatus(orderId, dto)).rejects.toThrow('Invalid status transition');
        });
    });
});
