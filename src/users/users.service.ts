import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(email, password): Promise<User> {
    const user = this.usersRepository.create({ email, password });
    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    user.createdAt = fullDate;
    return await this.usersRepository.save(user);
  }

  async createAdmin(email: string, password: string): Promise<User> {
    const user = this.usersRepository.create({ email, password });
    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    user.createdAt = fullDate;
    user.isAdmin = true;
    return await this.usersRepository.save(user);
  }

  async resetPassword(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    user.password = password;
    return await this.usersRepository.save(user);
  }

  async update(email): Promise<User> {
    const userFound = await this.findByEmail(email);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    userFound.isAdmin = true;
    userFound.isSuperAdmin = true;
    console.log(userFound);
    return await this.usersRepository.save(userFound);
  }

  async delete(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.usersRepository.remove(user);
  }

  async changeUserStatus(email: string): Promise<User> {
    const userFound = await this.findByEmail(email);
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    userFound.isActive = !userFound.isActive;
    return await this.usersRepository.save(userFound);
  }
}
