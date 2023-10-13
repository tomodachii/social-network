import { Logger, Module, Provider } from '@nestjs/common';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application';
import { WALLET_REPOSITORY } from './wallet.di-tokens';
import { WalletMapper } from './wallet.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { WalletRepository } from './infrastructure';
import { PrismaSampleService } from '@lib/sample-db';

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
  providers: [
    Logger,
    PrismaSampleService,
    ...eventHandlers,
    ...mappers,
    ...repositories,
  ],
})
export class WalletModule {}
