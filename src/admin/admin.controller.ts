import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  Param,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminDto } from './dtos/admin.dto';
import { AdminListDto } from './dtos/admin-list.dto';
import { AdminService } from './auth/admin.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { SuperAdmin } from '../guards/super-admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async loginAdmin(@Body() body: AdminDto, @Res() response: Response) {
    const result = await this.adminService.loginAdmin(body);
    return response.status(200).json(result);
  }

  @Get('list')
  @UseGuards(AuthGuard, AdminGuard)
  @Serialize(AdminListDto)
  async getAdmins() {
    return await this.adminService.getAdmins();
  }

  @Post('create-admin')
  @UseGuards(AuthGuard, SuperAdmin)
  async addAdmin(@Body() body: AdminDto) {
    const result = await this.adminService.addAdmin(body);
    return result;
  }

  @Delete('delete-admin/:email')
  @UseGuards(AuthGuard, SuperAdmin)
  async deleteAdmin(@Param('email') email: string) {
    const result = await this.adminService.deleteAdmin(email);
    return result;
  }

  // @Put('change-user-status/:email')
  // @UseGuards(AuthGuard, AdminGuard)
  // async changeUserStatus(@Param('email') userEmail: string) {
  //   const result = await this.adminService.changeUserStatus(userEmail);
  //   return result;
  // }
}
