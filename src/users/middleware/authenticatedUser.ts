import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class AuthUser implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      const decodedToken = await this.jwtService.verifyAsync(token);
      const email = decodedToken.email;
      if (email) {
        const user = await this.usersService.findByEmail(email);
        req.user = user;
      }
    }

    next();
  }
}
