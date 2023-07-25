import { normalizeString } from './../utils';
import { isUUID } from 'class-validator';
import { dbClient } from './../database';

export class GetUserHandler {
  private db = dbClient;

  async handle(identifier: string) {
    const user = await this.db.user.findFirst({
      where: {
        ...(isUUID(identifier)
          ? { id: identifier }
          : { email: normalizeString(identifier) }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        address: true,
        accessExpirationDate: true,
        canCreatePasses: true,
        hasChangedPassword: true,
        phone: true,
        role: true,
      },
    });

    return user;
  }
}
