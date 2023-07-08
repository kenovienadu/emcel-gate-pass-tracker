import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { generateJWT } from './../utils';
import { dbClient } from './../database';
import { LoginDTO } from './../dtos/login.dto';

@Injectable({ scope: Scope.REQUEST })
export class LoginHandler {
  async handle(dto: LoginDTO) {
    const user = await dbClient.user.checkPassword(dto.email, dto.password);

    if (!user) {
      throw new BadRequestException('Incorrect Credentials');
    }

    const recentPasses = await dbClient.gatePass.findMany({
      where: { generatedByUserId: user.id },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    delete user.passwordHash;
    const token = generateJWT(user);
    user['token'] = token;
    user['passes'] = recentPasses;

    return user;
  }
}
