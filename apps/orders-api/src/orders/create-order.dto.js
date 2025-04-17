var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
export class CreateOrderDto {
}
__decorate([
    ApiProperty({ example: 'product_123', required: true }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "product_id", void 0);
__decorate([
    ApiProperty({ example: 299.99, minimum: 0.01 }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "price", void 0);
__decorate([
    ApiProperty({ example: 2, minimum: 1 }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "quantity", void 0);
__decorate([
    ApiProperty({ example: 'customer_456', required: true }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customer_id", void 0);
__decorate([
    ApiProperty({ example: 'seller_789', required: true }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "seller_id", void 0);
