import { QueryBase } from '@lib/ddd';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaUserService, UserRecord } from 'apps/user-service/src/database';
import { Ok, Result } from 'oxide.ts';

export class FindUserByIdQuery extends QueryBase {
  readonly userId: string;
  constructor(userId: string) {
    super();
    this.userId = userId;
  }
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(private readonly prisma: PrismaUserService) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(query: FindUserByIdQuery): Promise<Result<UserRecord, Error>> {
    const user = await this.prisma.userRecord.findUnique({
      where: {
        id: query.userId,
      },
      include: {
        avatar: true,
        cover: true,
      },
    });

    return Ok(user);
  }
}
