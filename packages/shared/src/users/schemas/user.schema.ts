import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
}

@Schema({ timestamps: true })
export class User {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  country: string;

  @Prop({
    type: String,
    enum: UserRole,
    required: true
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
