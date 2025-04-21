import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
}

export enum UserEvents {
  LOGIN_REQUESTED = 'auth.verify',
}

export enum UserExchanges {
  DEFAULT = 'users_exchange',
}

export enum UserQueus {
  LOGIN = 'user_verify_queue',
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
