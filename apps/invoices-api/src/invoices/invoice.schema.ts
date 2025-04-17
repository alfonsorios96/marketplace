import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true })
  order_id: string;

  @Prop({ required: false })
  sent_at?: Date;

  @Prop({ required: true })
  file_path: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
