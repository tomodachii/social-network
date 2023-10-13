import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { WalletEntity, WalletRepositoryPort } from '../domain';
import { WalletMapper } from '../wallet.mapper';
import { PrismaSampleService } from '@lib/sample-db';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
// implements WalletRepositoryPort
export class WalletRepository implements WalletRepositoryPort {
  constructor(
    protected readonly prisma: PrismaSampleService,
    protected readonly mapper: WalletMapper,
    protected readonly eventBus: EventBus,
    protected readonly logger: Logger
  ) {}
  transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(handler);
  }

  async insert(entity: WalletEntity): Promise<void> {
    await this.prisma.walletRecord.create({
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
