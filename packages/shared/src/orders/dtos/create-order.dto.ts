import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({ example: 'product_123', required: true })
    @IsString() @IsNotEmpty() product_id: string;

    @ApiProperty({ example: 299.99, minimum: 0.01 })
    @IsNumber() @Min(0) price: number;

    @ApiProperty({ example: 2, minimum: 1 })
    @IsNumber() @Min(1) quantity: number;

    @ApiProperty({ example: 'customer_456', required: true })
    @IsString() @IsNotEmpty() customer_id: string;

    @ApiProperty({ example: 'seller_789', required: true })
    @IsString() @IsNotEmpty() seller_id: string;
}
