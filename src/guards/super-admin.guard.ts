import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/user.entity';

export class SuperAdmin implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authenticatedUser = request.user as User;
    if (!authenticatedUser.isSuperAdmin) {
      throw new UnauthorizedException('Super admin permission is required');
    }
    return true;
  }
}
