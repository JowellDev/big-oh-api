import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { User } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly sendGrid: SendGridService,
  ) {}

  async sendWelcomeMail(user: User): Promise<void> {
    await this.sendGrid.send({
      to: user.email,
      from: 'ephraimdigbeu@gmail.com',
      subject: 'Bienvenu sur The big oh',
      text: 'Inscription reussie, la communauté vous attend les bras ouverts.',
      html: `
        <h3>Welcome !</h3>
        <p>Aujourd'hui est un grand jour, nous nous sommes heureux de vous compter parmi nous</p>
        <p>On apprendra beaucoup de chose ensemble</p>
        <h4 style="color: blue;">Cordialement !</h4>
      `,
    });
  }

  async register(user: CreateUserDto) {
    const userFound = await this.usersService.findByEmail(user.email);
    if (userFound) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.generateHash(user.password);
    const newUser = await this.usersService.create(user.email, hashedPassword);
    const token = this.jwtService.sign({
      email: newUser.email,
    });

    const { password, isAdmin, isSuperAdmin, ...result } = newUser;
    await this.sendWelcomeMail(userFound);

    return {
      user: result,
      token,
    };
  }

  async login(user: CreateUserDto) {
    const userFound = await this.usersService.findByEmail(user.email);
    if (!userFound || !userFound.isActive) {
      throw new NotFoundException('invalid credentials');
    }

    const isValid = await bcrypt.compare(user.password, userFound.password);
    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      email: userFound.email,
    });

    const { password, isAdmin, isSuperAdmin, ...result } = userFound;
    return {
      user: result,
      token,
    };
  }

  async resetPassword(email: string, password: string) {
    const userFound = await this.usersService.findByEmail(email);
    if (!userFound || !userFound.isActive) {
      throw new NotFoundException('invalid credentials');
    }
    const hashedPassword = await this.generateHash(password);
    await this.usersService.resetPassword(email, hashedPassword);

    return {
      message: 'Password reset successfully',
    };
  }

  private async generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
