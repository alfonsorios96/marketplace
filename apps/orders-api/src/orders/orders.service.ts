import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Model } from 'mongoose';

import { Order, OrderDocument, OrderStatus, CreateOrderDto } from '@repo/shared';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      status: OrderStatus.CREATED,
    });
    return createdOrder.save();
  }

  async findAll(sellerId: string, status?: string): Promise<Order[]> {
    const query: Record<string, string> = { seller_id: sellerId };
    if (status) query.status = status;
    return this.orderModel.find(query);
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id);
  }

  async updateStatus(id: string, newStatus: OrderStatus): Promise<Order> {
    const validTransitions = {
      [OrderStatus.CREATED]: [OrderStatus.ACCEPTED, OrderStatus.REJECTED],
      [OrderStatus.ACCEPTED]: [OrderStatus.SHIPPING_IN_PROGRESS],
      [OrderStatus.SHIPPING_IN_PROGRESS]: [OrderStatus.SHIPPED],
    };

    const currentOrder = await this.orderModel.findById(id);
    if (!validTransitions[currentOrder.status].includes(newStatus)) {
      throw new Error(
          `Invalid status transition from ${currentOrder.status} to ${newStatus}`,
      );
    }

    if(newStatus === OrderStatus.SHIPPED) {
      await this.amqpConnection.publish('orders_exchange', 'order.shipped', {
        order_id: id,
      });
    }

    return this.orderModel
      .findByIdAndUpdate(id, { status: newStatus }, { new: true });
  }
}
