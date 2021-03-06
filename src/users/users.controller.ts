import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  UseGuards,
  Req,
  Param,
  Query,
  Delete,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { SuperAdmin } from '../guards/super-admin.guard';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const result = await this.authService.register(body);
    return result;
  }

  @Post('login')
  async login(@Body() body: CreateUserDto, @Res() response: Response) {
    const result = await this.authService.login(body);
    return response.status(200).json(result);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  @Post('logout')
  async logout(@Req() req: any) {
    req.user = null;
    return {
      message: 'logout success !',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Query('email') email: any,
    @Body('password') password: string,
  ) {
    const result = await this.authService.resetPassword(email, password);
    return result;
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async getUser(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Get('user/find-by-email/:email')
  @Serialize(UserDto)
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete('user/:id')
  @UseGuards(AuthGuard)
  async deleteAccount(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.usersService.deleteAccount(+id, user);
  }

  @Put('update')
  //@UseGuards(AdminGuard)
  @Serialize(UserDto)
  async update(@Body('email') email: any) {
    const result = await this.usersService.update(email);
    return result;
  }
}
