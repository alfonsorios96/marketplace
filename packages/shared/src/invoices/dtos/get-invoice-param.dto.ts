import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class GetInvoiceParamDto {
  @ApiProperty({
    name: 'orderId',
    type: 'string',
    description: 'Order ID (24 hex digits, ObjectId)',
    example: '60af8846b3a3c624e8e924b1',
  })
  @IsNotEmpty()
  @IsMongoId()
  orderId: string;
}