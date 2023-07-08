import { UserStatus } from '@prisma/client';
import { Injectable, BadRequestException } from '@nestjs/common';
import { getCurrentTimestamp } from './../utils';
import { PASSCODE_LENGTH } from './../constants';
import { dbClient } from './../database';

@Injectable()
export class VerifyGatePassHandler {
  async handle(passCode: string) {
    if (passCode.length !== PASSCODE_LENGTH) {
      throw new BadRequestException('Invalid code');
    }

    const gatePass = await dbClient.gatePass.findFirst({
      where: {
        code: passCode,
        expiresAt: {
          gt: getCurrentTimestamp(),
        },
        generatedBy: {
          deletedAt: null,
          status: UserStatus.ACTIVE,
        },
      },
      include: {
        generatedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!gatePass) {
      throw new BadRequestException('Invalid or expired code');
    }

    if (!gatePass.allowMultipleUses && gatePass.lastUsedAt) {
      throw new BadRequestException('Gate pass used');
    }

    await dbClient.gatePass.updateLastUsed(gatePass.id);
    return gatePass;
  }
}