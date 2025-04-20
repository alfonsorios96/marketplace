import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ValidationPipe,
  ParseEnumPipe,
} from '@nestjs/common';

import {
  OrderStatus,
  CreateOrderDto,
  UpdateOrderStatusDto,
} from '@repo/shared';

import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
      createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(
    @Query('seller_id', new ValidationPipe({ whitelist: true }))
      sellerId: string,
    @Query('status', new ParseEnumPipe(OrderStatus))
      status?: OrderStatus,
  ) {
    return this.ordersService.findAll(sellerId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
      updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status as OrderStatus,
    );
  }
}