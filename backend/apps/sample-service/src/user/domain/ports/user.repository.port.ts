import { PaginatedQueryParams, RepositoryPort } from '@lib/ddd';
import { UserEntity } from '..';
import { Option } from 'oxide.ts';

export interface FindUsersParams extends PaginatedQueryParams {
  readonly country?: string;
  readonly postalCode?: string;
  readonly street?: string;
}

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  insert(entity: UserEntity): Promise<boolean>;
  findOneById(id: string): Promise<Option<UserEntity>>;
  delete(entity: UserEntity): Promise<boolean>;
  findOneByEmail(email: string): Promise<UserEntity>;
  transaction<UserEntity>(
    handler: () => Promise<UserEntity>
  ): Promise<UserEntity>;
}
