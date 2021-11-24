import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AuthService } from './auth/auth.service';

@Module({
  controllers: [AdminController],
  providers: [AuthService],
  imports: [UsersModule],
})
export class AdminModule {}
