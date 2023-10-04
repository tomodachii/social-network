import { Logger, Module, Provider } from '@nestjs/common';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application';
import { WalletRepository } from './infrastructure';
import { WALLET_REPOSITORY } from './wallet.di-tokens';
import { WalletMapper, WalletPrismaMapper } from './wallet.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { WalletPrismaRepository } from './infrastructure/wallet.prisma.repo';
import { PrismaSampleService } from '@lib/sample-db';

const eventHandlers: Provider[] = [
  CreateWalletWhenUserIsCreatedDomainEventHandler,
];

const mappers: Provider[] = [WalletPrismaMapper];

const repositories: Provider[] = [
  { provide: WALLET_REPOSITORY, useClass: WalletPrismaRepository },
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
