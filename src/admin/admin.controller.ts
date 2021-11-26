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
  Query,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminDto } from './dtos/admin.dto';
import { AdminDetailDto } from './dtos/admin-detail.dto';
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
  @UseGuards(AdminGuard)
  @Serialize(AdminDetailDto)
  async getAdmins() {
    return await this.adminService.getAdmins();
  }

  @Post('create-admin')
  @UseGuards(SuperAdmin)
  @Serialize(AdminDetailDto)
  async addAdmin(@Body() body: AdminDto) {
    const result = await this.adminService.addAdmin(body);
    return result;
  }

  @Delete('delete-admin/:email')
  @UseGuards(SuperAdmin)
  async deleteAdmin(@Param('email') email: string) {
    const result = await this.adminService.deleteAdmin(email);
    return result;
  }

  @Put('change-user-status')
  @UseGuards(AdminGuard)
  @Serialize(AdminDetailDto)
  async changeUserStatus(@Query('email') userEmail: string) {
    const result = await this.adminService.changeUserStatus(userEmail);
    return result;
  }
}
