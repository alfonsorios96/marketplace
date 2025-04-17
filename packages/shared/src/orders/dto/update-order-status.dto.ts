import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
    @ApiProperty({
        enum: ['ACCEPTED', 'REJECTED', 'SHIPPING_IN_PROGRESS', 'SHIPPED'],
        example: 'ACCEPTED'
    })
    status: string;
}