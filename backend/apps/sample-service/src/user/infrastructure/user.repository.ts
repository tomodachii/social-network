import { PrismaSampleService, UserRecord } from '@lib/sample-db';
import { BaseRepository } from '@lib/common/databases';
import { UserRepositoryPort, UserEntity } from '../domain';
import { UserMapper } from '../user.mapper';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { None, Option, Some } from 'oxide.ts';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
// implements UserRepositoryPort
export class UserRepository
  extends BaseRepository<UserEntity, UserRecord>
  implements UserRepositoryPort
{
  constructor(
    protected readonly mapper: UserMapper,
    protected readonly eventBus: EventBus,
    protected readonly prisma: PrismaSampleService,
    protected readonly logger: Logger
  ) {
    super(mapper, eventBus, logger);
  }
  transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(handler);
  }

  async insert(entity: UserEntity): Promise<boolean> {
    const result = await this.prisma.userRecord.create({
      data: {
        id: entity.id,
        createdAt: entity.getPropsCopy().createdAt,
        updatedAt: entity.getPropsCopy().updatedAt,
        email: entity.getPropsCopy().email,
        postalCode: entity.getPropsCopy().address.postalCode,
        country: entity.getPropsCopy().address.country,
        street: entity.getPropsCopy().address.street,
        role: entity.getPropsCopy().role,
      },
    });
    entity.publishEvents(this.logger, this.eventBus);
    return result !== null;
  }
  async findOneById(id: string): Promise<Option<UserEntity>> {
    const result = await this.prisma.userRecord.findUnique({
      where: {
        id: id,
      },
    });
    return result ? Some(this.mapper.toDomain(result)) : None;
  }
  async delete(entity: UserEntity): Promise<boolean> {
    const result = await this.prisma.userRecord.delete({
      where: { id: entity.id },
    });
    return result !== null;
  }

  async updateAddress(user: UserEntity): Promise<void> {
    const address = user.getPropsCopy().address;

    const result = this.prisma.userRecord.update({
      data: {
        postalCode: address.postalCode,
        country: address.country,
        street: address.street,
      },
      where: {
        id: user.id,
      },
    });
    await Promise.resolve(result);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const result = await this.prisma.userRecord.findFirst({
      where: {
        email: email,
      },
    });
    return result ? this.mapper.toDomain(result) : null;
  }
}
