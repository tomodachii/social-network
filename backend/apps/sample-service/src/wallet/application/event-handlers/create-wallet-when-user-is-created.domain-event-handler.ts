import { Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../wallet.di-tokens';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedDomainEvent } from 'apps/sample-service/src/user/domain';
import { WalletRepositoryPort, WalletEntity } from '../../domain';

@EventsHandler(UserCreatedDomainEvent)
export class CreateWalletWhenUserIsCreatedDomainEventHandler
  implements IEventHandler<UserCreatedDomainEvent>
{
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: WalletRepositoryPort
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  handle(event: UserCreatedDomainEvent) {
    const wallet = WalletEntity.create({
      userId: event.aggregateId,
    });
    this.walletRepo.insert(wallet);
  }
}
