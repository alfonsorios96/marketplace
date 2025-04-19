import { Controller, Post, Body, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { User, UserPayload } from '@repo/shared';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('users')
  getUsers(): User[] {
    return this.usersService.getUsers();
  }

  @Post('login')
  login(@Body() body: UserPayload): { token: string; user: User } {
    const { token, user } = this.authService.signInByUserId(body.userId);
    return { token, user };
  }

  @MessagePattern('auth.verify-token')
  verifyToken(@Payload() token: string): UserPayload | null {
    return this.authService.verifyToken(token);
  }
}
