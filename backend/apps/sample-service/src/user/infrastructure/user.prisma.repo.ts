import { PrismaSampleService } from '@lib/sample-db';
import { UserRepositoryPort } from '../domain';
import { UserPrismaMapper } from '../user.mapper';
import { UserEntity } from '../domain/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserRecord } from './user.record';
import { None, Option, Some } from 'oxide.ts';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
// implements UserRepositoryPort
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(
    protected readonly mapper: UserPrismaMapper,
    protected readonly eventBus: EventBus,
    protected readonly prisma: PrismaSampleService,
    protected readonly logger: Logger
  ) {}
  transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(handler);
  }

  async insert(entity: UserEntity): Promise<boolean> {
    const result = await this.prisma.user.create({
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
    const result = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return result ? Some(this.mapper.toDomain(result)) : None;
  }
  async delete(entity: UserEntity): Promise<boolean> {
    const result = await this.prisma.user.delete({ where: { id: entity.id } });
    return result !== null;
  }

  async updateAddress(user: UserEntity): Promise<void> {
    const address = user.getPropsCopy().address;

    const result = this.prisma.user.update({
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
    const result = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return result ? this.mapper.toDomain(result) : null;
  }
}
