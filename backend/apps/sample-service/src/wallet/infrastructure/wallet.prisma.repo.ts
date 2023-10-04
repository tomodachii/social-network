import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { WalletEntity, WalletRepositoryPort } from '../domain';
import { WalletRecord } from './wallet.record';
import { WalletMapper, WalletPrismaMapper } from '../wallet.mapper';
import { PrismaSampleService } from '@lib/sample-db';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
// implements WalletRepositoryPort
export class WalletPrismaRepository implements WalletRepositoryPort {
  constructor(
    protected readonly prisma: PrismaSampleService,
    protected readonly mapper: WalletPrismaMapper,
    protected readonly eventBus: EventBus,
    protected readonly logger: Logger
  ) {}
  transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(handler);
  }

  async insert(entity: WalletEntity): Promise<void> {
    const result = await this.prisma.wallet.create({
      data: {
        id: entity.id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        balance: entity.getPropsCopy().balance,
        userId: entity.getPropsCopy().userId,
      },
    });
    return new Promise((resolve, reject) => {});
  }
}
