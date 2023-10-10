import { PaginatedParams, PaginatedQueryBase } from '@lib/ddd';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@lib/ddd';
import { PrismaSampleService, UserRecord } from '@lib/sample-db';
import { Prisma } from '@prisma/client/sample';

export class FindUsersQuery extends PaginatedQueryBase {
  readonly country?: string;

  readonly postalCode?: string;

  readonly street?: string;

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props);
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler implements IQueryHandler {
  constructor(private readonly prisma: PrismaSampleService) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(
    query: FindUsersQuery
  ): Promise<Result<Paginated<UserRecord>, Error>> {
    const filterQuery: Prisma.UserRecordWhereInput = {
      country: query.country,
      postalCode: query.postalCode,
      street: query.street,
    };
    const [data, count] = await this.prisma.$transaction([
      this.prisma.userRecord.findMany({
        skip: query.offset * query.limit,
        take: query.limit,
        where: filterQuery,
      }),
      this.prisma.userRecord.count({
        where: filterQuery,
      }),
    ]);

    return Ok(
      new Paginated({
        data: data,
        count: count,
        limit: query.limit,
        page: query.page,
      })
    );
  }
}
