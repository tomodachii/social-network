import { Logger, Module, Provider } from '@nestjs/common';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application';
import { WalletRepository } from './infrastructure';
import { WALLET_REPOSITORY } from './wallet.di-tokens';
import { WalletMapper } from './wallet.mapper';
import { CqrsModule } from '@nestjs/cqrs';

const eventHandlers: Provider[] = [
  CreateWalletWhenUserIsCreatedDomainEventHandler,
];

const mappers: Provider[] = [WalletMapper];

const repositories: Provider[] = [
  { provide: WALLET_REPOSITORY, useClass: WalletRepository },
];

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [Logger, ...eventHandlers, ...mappers, ...repositories],
})
export class WalletModule {}
