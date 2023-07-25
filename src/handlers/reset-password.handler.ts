import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { dbClient } from '../others/database';

@Injectable({ scope: Scope.REQUEST })
export class ResetPasswordHandler {
  private db = dbClient;

  async handle(userId: string, password = '') {
    const user = await this.db.user.findByEmailOrId(userId);

    if (!user) {
      throw new BadRequestException('Invalid User Id');
    }

    await this.db.user.setPassword(userId, password || user.phone);
  }
}
