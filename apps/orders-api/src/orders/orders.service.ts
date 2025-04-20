import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import {
  Order,
  OrderDocument,
  OrderStatus,
  CreateOrderDto,
  OrderExchanges,
  OrderEvents,
} from '@repo/shared';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly exchange: string;

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    this.exchange = this.configService.get<string>(
      'RABBITMQ_EXCHANGE',
      OrderExchanges.DEFAULT,
    );
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const created = new this.orderModel({
      ...dto,
      status: OrderStatus.CREATED,
    });
    const saved = await created.save();
    this.logger.log(`🆕 Order created id=${saved._id}`);
    return saved;
  }

  async findAll(
    sellerId: string,
    status?: OrderStatus,
  ): Promise<Order[]> {
    const filter: Record<string, any> = { seller_id: sellerId };
    if (status) filter.status = status;
    const docs = await this.orderModel.find(filter);
    return docs.map((d: any) => d._doc);
  }

  async findOne(id: string): Promise<Order> {
    const doc = await this.orderModel.findById(id);
    if (!doc) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return doc.toObject();
  }

  async updateStatus(
    id: string,
    newStatus: OrderStatus,
  ): Promise<Order> {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.CREATED]: [
        OrderStatus.ACCEPTED,
        OrderStatus.REJECTED,
      ],
      [OrderStatus.ACCEPTED]: [
        OrderStatus.SHIPPING_IN_PROGRESS,
      ],
      [OrderStatus.SHIPPING_IN_PROGRESS]: [
        OrderStatus.SHIPPED,
      ],
      [OrderStatus.REJECTED]: [],
      [OrderStatus.SHIPPED]: [],
    };

    const current = await this.orderModel.findById(id);
    if (!current) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (
      !validTransitions[current.status]?.includes(newStatus)
    ) {
      throw new BadRequestException(
        `Cannot change status from ${current.status} to ${newStatus}`,
      );
    }

    if (newStatus === OrderStatus.SHIPPED) {
      this.logger.log(
        `📤 Publishing ${OrderEvents.SHIPPED} for order ${id}`,
      );
      await this.amqpConnection.publish(
        this.exchange,
        OrderEvents.SHIPPED,
        { order_id: id },
      );
    }

    const updated = await this.orderModel
      .findByIdAndUpdate(
        id,
        { status: newStatus },
        { new: true },
      );

    return updated.toObject();
  }
}
