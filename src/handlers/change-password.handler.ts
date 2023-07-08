import { Injectable, BadRequestException } from '@nestjs/common';
import { dbClient } from './../database';
import { ChangePasswordDTO } from '../dtos/change-password.dto';

@Injectable()
export class ChangePasswordHandler {
  async handle(userId: string, dto: ChangePasswordDTO) {
    const user = await dbClient.user.checkPassword(userId, dto.password);

    if (!user) {
      throw new BadRequestException('Password is incorrect');
    }

    const updated = await dbClient.user.setPassword(user.id, dto.newPassword);
    if (!updated) {
      throw new BadRequestException('Sorry, an error occurred');
    }

    return {
      updated: true,
    };
  }
}
