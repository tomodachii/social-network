import { RepositoryPort } from '@lib/ddd';
import { UserEntity } from '../user.entity';
import { Option } from 'oxide.ts';

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  insertOne(user: UserEntity): Promise<boolean>;
  findById(userId: string): Promise<Option<UserEntity>>;
  updateAvatar(user: UserEntity): Promise<void>;
  udpateCover(user: UserEntity): Promise<void>;
  updateUserInfor(user: UserEntity): Promise<void>;
}
