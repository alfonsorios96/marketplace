import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
    CREATED = 'CREATED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    SHIPPING_IN_PROGRESS = 'SHIPPING_IN_PROGRESS',
    SHIPPED = 'SHIPPED',
}

export enum OrderEvents {
    SHIPPED = 'order.shipped',
}

export enum OrderExchanges {
    DEFAULT = 'orders_exchange',
}

export enum OrderQueus {
    SHIPPED = 'order_shipped_queue',
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    product_id: string;

    @Prop({ required: true, min: 0.01 })
    price: number;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true })
    customer_id: string;

    @Prop({ required: true })
    seller_id: string;

    @Prop({
        type: String,
        enum: OrderStatus,
        default: OrderStatus.CREATED,
        required: true
    })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
