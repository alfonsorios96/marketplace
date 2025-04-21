import { Controller, Post, Body, Get } from '@nestjs/common';
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
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post('login')
  async login(
    @Body() body: UserPayload,
  ): Promise<{ token: string; user: User }> {
    return await this.authService.signInByUserId(body.userId);
  }
}
