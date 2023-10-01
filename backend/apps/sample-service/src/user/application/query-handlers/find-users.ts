import { PaginatedParams, PaginatedQueryBase } from '@lib/ddd';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@lib/ddd';
import { UserRecord } from '../../infrastructure';
import { EntityManager } from '@mikro-orm/mysql';

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
  constructor(protected readonly em: EntityManager) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(
    query: FindUsersQuery
  ): Promise<Result<Paginated<UserRecord>, Error>> {
    const [data, count] = await this.em
      .createQueryBuilder(UserRecord, 'u')
      .select('*')
      .where({
        postalCode: query.postalCode,
        country: query.country,
        street: query.street,
      })
      .limit(query.limit)
      .offset(query.offset)
      .getResultAndCount();

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
