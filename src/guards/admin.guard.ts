import { UserRole } from '@prisma/client';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyJWT } from '../utils';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers['authorization']?.split(' ')[1];

      if (!token) {
        return false;
      }

      const user = verifyJWT(token);

      if (!user?.id || user.role !== UserRole.ADMIN) {
        return false;
      }

      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
