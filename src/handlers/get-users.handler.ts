import { Prisma, UserRole } from '@prisma/client';
import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { isEnum } from 'class-validator';
import { dbClient } from '../others/database';
import { getPaginationParamsFromQuery } from '../others/utils';

@Injectable({ scope: Scope.REQUEST })
export class GetUsersHandler {
  async handle(query: Record<string, string> = {}) {
    const role = query.role ? String(query.role).toUpperCase() : null;
    const { itemsPerPage, skip, page } = getPaginationParamsFromQuery(query);

    if (role && !isEnum(role, UserRole)) {
      throw new BadRequestException('Invalid Role Requested');
    }

    const userWhereFilter: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(role && { role: role as UserRole }),
    };

    const [total, items] = await Promise.all([
      // Total Count
      dbClient.user.count({ where: userWhereFilter }),

      // Items
      dbClient.user.findMany({
        where: userWhereFilter,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          address: true,
          role: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: itemsPerPage,
        skip,
      }),
    ]);

    const pageCount = Math.ceil(total / itemsPerPage);

    return {
      currentPage: page,
      pageCount,
      itemsPerPage,
      total,
      items,
    };
  }
}
