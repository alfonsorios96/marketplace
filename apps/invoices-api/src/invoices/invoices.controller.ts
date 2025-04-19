import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoicesService } from './invoices.service';
import { UploadInvoiceDto } from '@repo/shared';
import { multerConfig } from '../../multer.config';
import { Express } from 'express';

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
  async getByOrder(@Param('orderId') orderId: string) {
    return this.invoicesService.findByOrder(orderId);
  }
}
