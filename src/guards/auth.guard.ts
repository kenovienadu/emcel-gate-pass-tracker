import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyJWT } from '../others/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers['authorization']?.split(' ')[1];

      if (!token) {
        return false;
      }

      const user = await verifyJWT(token);

      if (!user?.id) {
        return false;
      }

      request.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}
