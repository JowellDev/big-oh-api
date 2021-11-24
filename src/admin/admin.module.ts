import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AdminController],
  providers: [AuthService],
  imports: [UsersModule],
})
export class AdminModule {}
