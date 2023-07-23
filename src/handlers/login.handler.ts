import { UserRole } from '@prisma/client';
import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { generateJWT } from './../utils';
import { dbClient } from './../database';
import { LoginDTO } from './../dtos/login.dto';
import { subHours } from 'date-fns';

@Injectable({ scope: Scope.REQUEST })
export class LoginHandler {
  async handle(dto: LoginDTO) {
    const user = await dbClient.user.checkPassword(dto.email, dto.password);

    if (!user) {
      throw new BadRequestException('Incorrect Credentials');
    }

    delete user.passwordHash;
    const token = generateJWT(user);

    user['token'] = token;

    if (user.role !== UserRole.SECURITY) {
      user['passes'] = await this.getRecentPasses(user.id);
    } else {
      user['recentlyVerified'] = await this.getRecentlyVerifiedPasses(user.id);
    }

    return user;
  }

  private async getRecentPasses(userId: string) {
    const recentPasses = await dbClient.gatePass.findMany({
      where: { generatedByUserId: userId },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return recentPasses;
  }

  private async getRecentlyVerifiedPasses(userId: string) {
    const currentTime = new Date();
    const recentlyVerifiedPasses = await dbClient.gatePass.findMany({
      where: {
        lastVerifiedById: userId,
        createdAt: {
          gte: subHours(currentTime, 24), // recent passes verified in the last twenty four hours
        },
      },
      take: 30,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return recentlyVerifiedPasses;
  }
}
