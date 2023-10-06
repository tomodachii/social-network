import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { WalletEntity, WalletRepositoryPort } from '../domain';
import { WalletMapper } from '../wallet.mapper';
import { PrismaSampleService, Wallet } from '@lib/sample-db';
import { BaseRepository } from '@lib/common/databases';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
// implements WalletRepositoryPort
export class WalletRepository
  extends BaseRepository<WalletEntity, Wallet>
  implements WalletRepositoryPort
{
  constructor(
    protected readonly prisma: PrismaSampleService,
    protected readonly mapper: WalletMapper,
    protected readonly eventBus: EventBus,
    protected readonly logger: Logger
  ) {
    super(prisma, mapper, eventBus, logger);
  }

  async insert(entity: WalletEntity): Promise<void> {
    await this.prisma.wallet.create({
      data: {
        id: entity.id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        balance: entity.getPropsCopy().balance,
        userId: entity.getPropsCopy().userId,
      },
    });
    return new Promise((resolve) => resolve());
  }
}
