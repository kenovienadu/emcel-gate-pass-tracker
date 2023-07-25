import { getCurrentTimestamp } from '../others/utils';
import { Injectable, Scope } from '@nestjs/common';
import { dbClient } from '../others/database';
import { addHours } from 'date-fns';
import * as otpGenerator from 'otp-generator';
import { GeneratePassDTO } from '../dtos/generate-pass.dto';

@Injectable({ scope: Scope.REQUEST })
export class GeneratePassHandler {
  async handle(userId: string, dto: GeneratePassDTO) {
    const code = this.generateOTP();
    const gatePass = await dbClient.gatePass.create({
      data: {
        allowMultipleUses: dto.allowMultipleUses || false,
        guestName: dto.guestName,
        arrivalMode: dto.arrivalMode,
        expiresAt: addHours(getCurrentTimestamp(), 8), // expires in 8 hours
        lastUsedAt: null,
        code,
        generatedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return gatePass;
  }

  private generateOTP(length = 6): string {
    const otp: string = otpGenerator.generate(length, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    if (String(otp).length !== length) {
      return this.generateOTP(length);
    }

    return String(otp);
  }
}
