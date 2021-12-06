import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AdminDto } from '../dtos/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async loginAdmin(user: AdminDto) {
    const userFound = await this.usersService.findByEmail(user.email);
    if (!userFound || !userFound.isActive || !userFound.isAdmin) {
      throw new NotFoundException('invalid credentials');
    }

    const isValid = await bcrypt.compare(user.password, userFound.password);
    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      email: userFound.email,
    });

    const { password, ...result } = userFound;

    return {
      user: result,
      token,
    };
  }

  async addAdmin(user: AdminDto) {
    const userFound = await this.usersService.findByEmail(user.email);
    if (userFound) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.generateHash(user.password);
    const newAdmin = await this.usersService.createAdmin(
      user.email,
      hashedPassword,
    );

    const { password, isAdmin, isSuperAdmin, ...result } = newAdmin;
    return result;
  }

  async getAdmins() {
    return await this.usersService.findAdmins();
  }

  private async generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async deleteAdmin(email: string) {
    const admin = await this.usersService.findByEmail(email);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.usersService.deleteAdmin(email);

    return {
      message: 'Admin deleted',
    };
  }

  async changeUserStatus(email: string) {
    return await this.usersService.changeUserStatus(email);
  }

  async getAllMembers() {
    return await this.usersService.getAllMembers();
  }

  async changeUserRole(email: string, isAdmin: boolean) {}
}
