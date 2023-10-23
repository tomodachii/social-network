import { AggregateRoot, Mapper } from '@lib/ddd';
import { LoggerPort } from '@lib/common/ports';
import { ObjectLiteral } from '@lib/common/types';
import { EventBus } from '@nestjs/cqrs';

export abstract class BaseRepository<
  Aggregate extends AggregateRoot<any>,
  DbRecord extends ObjectLiteral
> {
  protected constructor(
    protected readonly mapper: Mapper<Aggregate, DbRecord>,
    protected readonly eventBus: EventBus,
    protected readonly logger: LoggerPort
  ) {}
}
