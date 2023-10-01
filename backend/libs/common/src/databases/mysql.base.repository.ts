// import {
//   AggregateRoot,
//   PaginatedQueryParams,
//   Paginated,
//   RepositoryPort,
//   Mapper,
// } from '@lib/ddd';
// import { None, Option, Some } from 'oxide.ts';
// import { LoggerPort } from '@lib/common/ports';
// import { ObjectLiteral } from '@lib/common/types';
// import { EventPublisher } from '@nestjs/cqrs';
// import { EntityRepository, FilterQuery } from '@mikro-orm/core';

// export abstract class BaseRepository<
//   Aggregate extends AggregateRoot<any>,
//   DbRecord extends ObjectLiteral
// > implements RepositoryPort<Aggregate>
// {
//   protected constructor(
//     protected readonly repo: EntityRepository<DbRecord>,
//     protected readonly mapper: Mapper<Aggregate, DbRecord>,
//     protected readonly eventBus: EventPublisher,
//     protected readonly logger: LoggerPort
//   ) {}

//   async findOneById(id: string): Promise<Option<Aggregate>> {
//     const query = sql.type(this.schema)`SELECT * FROM ${sql.identifier([
//       this.tableName,
//     ])} WHERE id = ${id}`;
//     const filterQuery: FilterQuery<DbRecord> = { id };
//     const result = await this.repo.find({ id });
//     return result.rows[0] ? Some(this.mapper.toDomain(result.rows[0])) : None;
//   }

//   /**
//    * start a global transaction to save
//    * results of all event handlers in one operation
//    */
//   public async transaction<T>(handler: () => Promise<T>): Promise<T> {
//     const em = this.em.fork();
//     await em.begin();
//     let result: Promise<T>;
//     try {
//       result = handler();
//       await em.commit(); // will flush before making the actual commit query
//     } catch (e) {
//       await em.rollback();
//       throw e;
//     }
//     return result;
//   }
// }
