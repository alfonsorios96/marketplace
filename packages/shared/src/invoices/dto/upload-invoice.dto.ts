import { ApiProperty } from '@nestjs/swagger';

export class UploadInvoiceDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'PDF file' })
    file: any;
}