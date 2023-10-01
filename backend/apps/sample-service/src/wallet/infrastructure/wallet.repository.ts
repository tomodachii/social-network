import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { BaseRepository } from '@lib/common/databases';
import { WalletEntity, WalletRepositoryPort } from '../domain';
import { WalletRecord } from './wallet.record';
import { WalletMapper } from '../wallet.mapper';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
// implements WalletRepositoryPort
export class WalletRepository
  extends BaseRepository<WalletEntity, WalletRecord>
  implements WalletRepositoryPort
{
  constructor(
    protected readonly orm: MikroORM,
    protected readonly mapper: WalletMapper,
    protected readonly eventBus: EventBus,
    protected readonly em: EntityManager
  ) {
    super(orm, mapper, eventBus, new Logger('WalletRepository'));
  }

  insert(entity: WalletEntity): Promise<void> {
    return this.em
      .createQueryBuilder(WalletRecord)
      .insert({
        id: entity.id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        balance: entity.getPropsCopy().balance,
        userId: entity.getPropsCopy().userId,
      })
      .execute();
  }
}
