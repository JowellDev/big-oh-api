import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    const userFound = await this.usersService.findByEmail(user.email);
    if (userFound) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.generateHash(user.password);
    const newUser = await this.usersService.create(user.email, hashedPassword);
    const token = this.jwtService.sign({
      email: newUser.email,
    });
    return {
      user: newUser,
      token,
    };
  }

  async login(user: CreateUserDto) {
    const userFound = await this.usersService.findByEmail(user.email);
    if (!userFound) {
      throw new Error('invalid credentials');
    }

    const isValid = await bcrypt.compare(user.password, userFound.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.sign({
      email: userFound.email,
    });

    return {
      user: userFound,
      token,
    };
  }

  async generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
