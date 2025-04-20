import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadInvoiceDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'PDF file' })
  file!: Express.Multer.File;

  @IsString() @IsNotEmpty() order_id: string;
}
