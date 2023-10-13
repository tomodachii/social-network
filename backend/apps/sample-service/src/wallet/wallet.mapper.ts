import { Mapper } from '@lib/ddd';
import { Injectable } from '@nestjs/common';
import { WalletEntity } from './domain';
import { WalletRecord } from '@prisma/client/sample';

@Injectable()
export class WalletMapper implements Mapper<WalletEntity, WalletRecord> {
  toPersistence(entity: WalletEntity): WalletRecord {
    const copy = entity.getPropsCopy();
    const record: WalletRecord = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      userId: copy.userId,
      balance: copy.balance,
    };
    return record;
  }

  toDomain(record: WalletRecord): WalletEntity {
    const entity = new WalletEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: record.userId,
        balance: record.balance,
      },
    });
    return entity;
  }

  toResponse(): any {
    throw new Error('Not implemented');
  }
}
