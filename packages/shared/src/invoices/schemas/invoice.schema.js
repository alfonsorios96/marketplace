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
let Invoice = class Invoice {
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Invoice.prototype, "order_id", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Invoice.prototype, "invoice_id", void 0);
__decorate([
    Prop({ required: false }),
    __metadata("design:type", Date)
], Invoice.prototype, "sent_at", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Invoice.prototype, "file_path", void 0);
Invoice = __decorate([
    Schema({ timestamps: true })
], Invoice);
export { Invoice };
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
