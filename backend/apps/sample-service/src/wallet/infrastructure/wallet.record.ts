import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectLiteral } from '@lib/common/types';

@Entity({ tableName: 'wallet' })
export class WalletRecord implements ObjectLiteral {
  @PrimaryKey()
  id: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  @Property({})
  balance: number;

  @Property({ length: 255 })
  userId: string;
}
