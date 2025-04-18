import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Model } from 'mongoose';

import { Order, OrderDocument, OrderStatus } from './order.schema';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject('ORDER_EMITTER')
    private readonly clientProxy: ClientProxy,
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
    return this.orderModel.find(query).exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
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

    await this.publish('order.shipped', {
      order_id: id,
    });

    return this.orderModel
      .findByIdAndUpdate(id, { status: newStatus }, { new: true })
      .exec();
  }

  private async publish(key:string, data: { order_id: string }): Promise<void> {
    await firstValueFrom(
        this.clientProxy.emit(key, data).pipe(
            catchError((exception: Error) => {
              return throwError(() => new Error(exception.message));
            }),
        ),
    );
  }
}
