import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRoles } from '../domain';
import { ObjectLiteral } from '@lib/common/types';

@Entity({ tableName: 'user' })
export class UserRecord implements ObjectLiteral {
  @PrimaryKey()
  id: string;

  @Property({})
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  @Property()
  email: string;

  @Property({ length: 255 })
  country: string;

  @Property({ length: 255 })
  postalCode: string;

  @Property({ length: 255 })
  street: string;

  @Enum(() => UserRoles)
  role: UserRoles;
}
