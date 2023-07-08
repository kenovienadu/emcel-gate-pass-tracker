import { getCurrentTimestamp } from './../utils';
import { Injectable, Scope } from '@nestjs/common';
import { dbClient } from '../database';
import { addHours } from 'date-fns';
import * as otpGenerator from 'otp-generator';

@Injectable({ scope: Scope.REQUEST })
export class GeneratePassHandler {
  async handle(userId: string, allowMultipleUses = false) {
    const code = this.generateOTP();
    const gatePass = await dbClient.gatePass.create({
      data: {
        allowMultipleUses,
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