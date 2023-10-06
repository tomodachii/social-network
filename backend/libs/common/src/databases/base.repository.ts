import {
  AggregateRoot,
  PaginatedQueryParams,
  Paginated,
  RepositoryPort,
  Mapper,
} from '@lib/ddd';
import { None, Option, Some } from 'oxide.ts';
import { LoggerPort } from '@lib/common/ports';
import { ObjectLiteral } from '@lib/common/types';
import { EventBus } from '@nestjs/cqrs';
import { RequestContextService } from '@lib/common/application';
import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<
  Aggregate extends AggregateRoot<any>,
  DbRecord extends ObjectLiteral
> implements RepositoryPort<Aggregate>
{
  protected constructor(
    protected readonly prisma: PrismaClient,
    protected readonly mapper: Mapper<Aggregate, DbRecord>,
    protected readonly eventBus: EventBus,
    protected readonly logger: LoggerPort
  ) {}
  /**
   * start a global transaction to save
   * results of all event handlers in one operation
   */
  public async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(handler);
  }
}
