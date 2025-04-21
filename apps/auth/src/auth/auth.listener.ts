import { Injectable } from '@nestjs/common';
import {
  UserEvents,
  UserExchanges,
  UserPayload,
  UserQueus,
} from '@repo/shared';

import { AuthService } from './auth.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AuthListener {
  constructor(private readonly authService: AuthService) {}

  @RabbitSubscribe({
    exchange: UserExchanges.DEFAULT,
    routingKey: UserEvents.LOGIN_REQUESTED,
    queue: UserQueus.LOGIN,
  })
  verifyToken(token: string): UserPayload | null {
    return this.authService.verifyToken(token);
  }
}
