import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@repo/shared';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UsersService,
  ) {}

  signInByUserId(id: string): { token: string; user: User } {
    const user = this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return { token, user };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
