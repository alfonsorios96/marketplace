import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
    @ApiProperty({
        enum: ['ACCEPTED', 'REJECTED', 'SHIPPING_IN_PROGRESS', 'SHIPPED'],
        example: 'ACCEPTED'
    })
    @IsString() @IsNotEmpty() status: string;
}