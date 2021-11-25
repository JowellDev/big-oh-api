import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth/auth.service';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto, @Res() response: Response) {
    const result = await this.authService.register(body);
    return result;
  }

  @Post('login')
  async login(@Body() body: CreateUserDto) {
    const result = await this.authService.login(body);
    return result;
  }

  @Get('me')
  async current(@Body() body: CreateUserDto) {}

  @Post('logout')
  async logout(@Body() body: CreateUserDto) {}

  @Post('refresh')
  async refresh(@Body() body: CreateUserDto) {}

  @Post('reset-password')
  async resetPassword(@Body() body: CreateUserDto) {}
}
