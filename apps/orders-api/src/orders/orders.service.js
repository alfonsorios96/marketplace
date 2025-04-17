var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './order.schema';
let OrdersService = class OrdersService {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async create(createOrderDto) {
        const createdOrder = new this.orderModel({
            ...createOrderDto,
            status: OrderStatus.CREATED,
        });
        return createdOrder.save();
    }
    async findAll(sellerId, status) {
        const query = { seller_id: sellerId };
        if (status)
            query.status = status;
        return this.orderModel.find(query).exec();
    }
    async findOne(id) {
        return this.orderModel.findById(id).exec();
    }
    async updateStatus(id, newStatus) {
        const validTransitions = {
            [OrderStatus.CREATED]: [OrderStatus.ACCEPTED, OrderStatus.REJECTED],
            [OrderStatus.ACCEPTED]: [OrderStatus.SHIPPING_IN_PROGRESS],
            [OrderStatus.SHIPPING_IN_PROGRESS]: [OrderStatus.SHIPPED],
        };
        const currentOrder = await this.orderModel.findById(id);
        if (!validTransitions[currentOrder.status].includes(newStatus)) {
            throw new Error(`Invalid status transition from ${currentOrder.status} to ${newStatus}`);
        }
        return this.orderModel
            .findByIdAndUpdate(id, { status: newStatus }, { new: true })
            .exec();
    }
};
OrdersService = __decorate([
    Injectable(),
    __param(0, InjectModel(Order.name)),
    __metadata("design:paramtypes", [Model])
], OrdersService);
export { OrdersService };
