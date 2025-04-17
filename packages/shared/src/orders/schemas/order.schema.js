var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CREATED"] = "CREATED";
    OrderStatus["ACCEPTED"] = "ACCEPTED";
    OrderStatus["REJECTED"] = "REJECTED";
    OrderStatus["SHIPPING_IN_PROGRESS"] = "SHIPPING_IN_PROGRESS";
    OrderStatus["SHIPPED"] = "SHIPPED";
})(OrderStatus || (OrderStatus = {}));
let Order = class Order {
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "product_id", void 0);
__decorate([
    Prop({ required: true, min: 0.01 }),
    __metadata("design:type", Number)
], Order.prototype, "price", void 0);
__decorate([
    Prop({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Order.prototype, "quantity", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "customer_id", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "seller_id", void 0);
__decorate([
    Prop({
        type: String,
        enum: OrderStatus,
        default: OrderStatus.CREATED,
        required: true
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
Order = __decorate([
    Schema({ timestamps: true })
], Order);
export { Order };
export const OrderSchema = SchemaFactory.createForClass(Order);
