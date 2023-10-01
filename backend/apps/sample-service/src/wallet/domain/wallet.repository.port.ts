import { RepositoryPort } from '@lib/ddd';
import { WalletEntity } from './wallet.entity';

export interface WalletRepositoryPort extends RepositoryPort<WalletEntity> {
  insert(entity: WalletEntity): Promise<void>;
}
