import { UserRepositoryPort } from '../domain';
import { UserMapper } from '../user.mapper';
import { UserEntity } from '../domain/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { MikroORM } from '@mikro-orm/core';
import { UserRecord } from './user.record';
import { EntityManager } from '@mikro-orm/mysql';
import { None, Option, Some } from 'oxide.ts';
import { BaseRepository } from '@lib/common/databases';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
// implements UserRepositoryPort
export class UserRepository
  extends BaseRepository<UserEntity, UserRecord>
  implements UserRepositoryPort
{
  constructor(
    protected readonly orm: MikroORM,
    protected readonly mapper: UserMapper,
    protected readonly eventBus: EventBus,
    protected readonly em: EntityManager
  ) {
    super(orm, mapper, eventBus, new Logger('UserRepository'));
  }

  async insert(entity: UserEntity): Promise<boolean> {
    const result = await this.em
      .createQueryBuilder(UserRecord)
      .insert({
        id: entity.id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        country: entity.getPropsCopy().address.country,
        street: entity.getPropsCopy().address.street,
        postalCode: entity.getPropsCopy().address.postalCode,
        email: entity.getPropsCopy().email,
        role: entity.getPropsCopy().role,
      })
      .execute();
    entity.publishEvents(this.logger, this.eventBus);
    return result.affectedRows > 0;
  }
  async findOneById(id: string): Promise<Option<UserEntity>> {
    const result = await this.em
      .createQueryBuilder(UserRecord, 'u')
      .select('*')
      .where({ id })
      .getSingleResult();
    return result[0] ? Some(this.mapper.toDomain(result[0])) : None;
  }
  delete(entity: UserEntity): Promise<boolean> {
    return this.em
      .createQueryBuilder(UserRecord, 'u')
      .delete()
      .where({ id: entity.id })
      .execute();
  }

  updateAddress(user: UserEntity): Promise<void> {
    const address = user.getPropsCopy().address;

    const qb = this.em.createQueryBuilder(UserRecord, 'u');
    return qb
      .update({
        country: address.country,
        street: address.street,
        postalCode: address.postalCode,
      })
      .where({ id: user.id })
      .execute();
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const qb = this.em.createQueryBuilder(UserRecord, 'u');
    const result = await qb.select('*').where({ email }).execute();
    return result[0] ? this.mapper.toDomain(result[0]) : null;
  }
}
