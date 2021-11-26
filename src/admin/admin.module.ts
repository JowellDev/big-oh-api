import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './auth/admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'SECRET_CODE',
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AdminModule {}
