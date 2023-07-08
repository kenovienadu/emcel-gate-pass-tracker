import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { DEFAULT_PASSWORD } from './../constants';
import { normalizeString, hashPassword } from './../utils';
import { AddUserDTO } from '../dtos/add-user.dto';
import { dbClient } from '../database';
import { UserRole } from '@prisma/client';

@Injectable()
export class AddUserHandler {
  async handle(dto: AddUserDTO) {
    const existingUserWithEmail = await this.checkUserUniqueField(dto.email);
    if (existingUserWithEmail) {
      throw new BadRequestException('User exists with this email');
    }

    const existingUserWithPhone = await this.checkUserUniqueField(dto.phone);
    if (existingUserWithPhone) {
      throw new BadRequestException('User exists with this phone number');
    }

    const newUser = await dbClient.user.create({
      data: {
        firstName: normalizeString(dto.firstName),
        lastName: normalizeString(dto.lastName),
        email: normalizeString(dto.email),
        phone: dto.phone,
        passwordHash: hashPassword(DEFAULT_PASSWORD),
        address: dto.address,
        role: dto.role || UserRole.RESIDENT,
      },
    });

    delete newUser.passwordHash;
    return newUser;
  }

  private async checkUserUniqueField(emailOrPhone: string) {
    const query = isEmail(emailOrPhone)
      ? { email: normalizeString(emailOrPhone) }
      : { phone: emailOrPhone };
    const user = await dbClient.user.findFirst({ where: query });
    return user || null;
  }
}
