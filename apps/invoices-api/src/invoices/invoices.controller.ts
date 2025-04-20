import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { UploadInvoiceDto } from '@repo/shared';

import { InvoicesService } from './invoices.service';
import { multerConfig } from '../../multer.config';
import { Express } from 'express';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadInvoice(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadInvoiceDto: UploadInvoiceDto,
  ) {
    return this.invoicesService.create({
      order_id: uploadInvoiceDto.order_id,
      file,
    });
  }

  @Get(':orderId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getByOrder(@Param('orderId') orderId: string) {
    return this.invoicesService.findByOrder(orderId);
  }
}
