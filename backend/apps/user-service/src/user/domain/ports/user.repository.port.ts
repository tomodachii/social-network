import { RepositoryPort } from '@lib/ddd';
import { UserEntity } from '../user.entity';
import { Option } from 'oxide.ts';

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  insertOne(user: UserEntity): Promise<boolean>;
  findById(userId: string): Promise<Option<UserEntity>>;
  updateAvatar(user: UserEntity): Promise<boolean>;
  updateCover(user: UserEntity): Promise<boolean>;
  updateUserProfile(user: UserEntity): Promise<boolean>;
}
