import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({ example: 'product_123', required: true })
    product_id: string;

    @ApiProperty({ example: 299.99, minimum: 0.01 })
    price: number;

    @ApiProperty({ example: 2, minimum: 1 })
    quantity: number;

    @ApiProperty({ example: 'customer_456', required: true })
    customer_id: string;

    @ApiProperty({ example: 'seller_789', required: true })
    seller_id: string;
}
