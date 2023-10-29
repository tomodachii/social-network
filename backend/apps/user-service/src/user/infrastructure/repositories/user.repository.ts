import { BaseRepository } from '@lib/common/databases';
import { BioImageType, UserEntity, UserRepositoryPort } from '../../domain';
import { PrismaUserService, UserRecord } from '../../../database';
import { EventBus } from '@nestjs/cqrs';
import { UserMapper } from '../../user.mapper';
import { Logger, Injectable } from '@nestjs/common';
import { None, Option, Some } from 'oxide.ts';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity, UserRecord>
  implements UserRepositoryPort
{
  constructor(
    protected readonly mapper: UserMapper,
    protected readonly eventBus: EventBus,
    protected readonly prisma: PrismaUserService,
    protected readonly logger: Logger
  ) {
    super(mapper, eventBus, logger);
  }

  async insertOne(user: UserEntity): Promise<boolean> {
    const record = this.mapper.toPersistence(user);
    const createUser = this.prisma.userRecord.create({
      data: {
        firstName: record.firstName,
        lastName: record.lastName,
        gender: record.gender,
        id: record.id,
        birthDay: record.birthDay,
      },
    });
    return (await createUser) !== null;
  }

  async findById(userId: string): Promise<Option<UserEntity>> {
    const record = await this.prisma.userRecord.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
        cover: true,
      },
    });
    return record ? Some(this.mapper.toDomain(record)) : None;
  }

  async updateAvatar(user: UserEntity): Promise<void> {
    const userRecord = this.mapper.toPersistence(user);
    const avatarRecord = userRecord.avatar;
    await this.prisma.bioImageRecord.create({
      data: {
        extension: avatarRecord.extension,
        size: avatarRecord.size,
        type: avatarRecord.type,
        id: avatarRecord.id,
        createdAt: avatarRecord.createdAt,
        updatedAt: avatarRecord.updatedAt,
        avatarUser: {
          connect: {
            id: userRecord.id,
          },
        },
      },
    });
  }

  async udpateCover(user: UserEntity): Promise<void> {
    const userRecord = this.mapper.toPersistence(user);
    const coverRecord = userRecord.cover;

    await this.prisma.bioImageRecord.create({
      data: {
        extension: coverRecord.extension,
        size: coverRecord.size,
        type: coverRecord.type,
        id: coverRecord.id,
        createdAt: coverRecord.createdAt,
        updatedAt: coverRecord.updatedAt,
        avatarUser: {
          connect: {
            id: userRecord.id,
          },
        },
      },
    });
  }

  async deleteBioImage(user: UserEntity, type: BioImageType): Promise<void> {
    const userRecord = this.mapper.toPersistence(user);
    await this.prisma.bioImageRecord.deleteMany({
      where: {
        avatarUser: {
          id: userRecord.id,
        },
        type: type,
      },
    });
  }

  async updateUserInfor(user: UserEntity): Promise<void> {
    const record = this.mapper.toPersistence(user);
    await this.prisma.userRecord.update({
      where: { id: record.id },
      data: {
        firstName: record.firstName,
        lastName: record.lastName,
        gender: record.gender,
        bio: record.bio,
        birthDay: record.birthDay,
        postalCode: record.postalCode,
        city: record.city,
        version: {
          increment: 1,
        },
      },
    });
  }
}
