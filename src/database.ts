import {
  normalizeString,
  passwordMatches,
  hashPassword,
  getCurrentTimestamp,
} from './utils';
import { isEmail } from 'class-validator';
import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient();

async function _getUserByIdentifier(emailOrId: string) {
  const user = await prismaClient.user.findFirst({
    where: {
      ...(isEmail(emailOrId)
        ? { email: normalizeString(emailOrId) }
        : { id: emailOrId }),
    },
  });

  return user || null;
}

export const dbClient = prismaClient.$extends({
  name: 'checkPassword',
  model: {
    user: {
      async getByIdentifier(emailOrId: string) {
        const user = await _getUserByIdentifier(emailOrId);
        return user || null;
      },

      async checkPassword(emailOrId: string, password: string) {
        const user = await _getUserByIdentifier(emailOrId);

        if (!user || !passwordMatches(password, user.passwordHash)) {
          return null;
        }

        return user;
      },

      async setPassword(emailOrId: string, password: string) {
        const user = await _getUserByIdentifier(emailOrId);

        if (!user) {
          return false;
        }

        await prismaClient.user.update({
          where: {
            id: user.id,
          },
          data: {
            passwordHash: hashPassword(password),
            hasChangedPassword: true,
          },
        });

        return true;
      },
    },

    gatePass: {
      async updateLastUsed(passId: string, timestamp: Date = null) {
        return prismaClient.gatePass.update({
          where: { id: passId },
          data: {
            lastUsedAt: timestamp || getCurrentTimestamp(),
          },
        });
      },
    },
  },
});
