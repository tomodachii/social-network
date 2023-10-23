import { Mapper } from '@lib/ddd';
import {
  AddressVO,
  BioImageType,
  BioImageEntity,
  ConfigEntity,
  Gender,
  UserEntity,
} from './domain';
import { UserPrersistent, UserRecord } from './infrastructure';
import { UserResponseDto } from './application';

export class UserMapper
  implements Mapper<UserEntity, UserRecord, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserPrersistent {
    const copy = entity.getPropsCopy();
    const record: UserPrersistent = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      postalCode: copy.address.postalCode,
      city: copy.address.city,
      firstName: copy.firstName,
      lastName: copy.lastName,
      gender: copy.gender,
      bio: copy.bio,
      dateOfBirth: copy.dateOfBirth,
      configId: copy.config.id,
      avatarId: copy.avatar.id,
      coverId: copy.cover.id,
      avatar: copy.avatar.getPropsCopy(),
      cover: copy.cover.getPropsCopy(),
    };
    return record;
  }
  toDomain(record: UserPrersistent): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        firstName: record.firstName,
        lastName: record.lastName,
        gender: record.gender as Gender,
        bio: record.bio,
        dateOfBirth: new Date(record.dateOfBirth),
        address: new AddressVO({
          postalCode: record.postalCode,
          city: record.city,
        }),
        config: new ConfigEntity({
          id: record.configId,
          props: {},
        }),
        avatar: new BioImageEntity({
          id: record.avatarId,
          props: {
            extension: record.avatar.extension,
            size: record.avatar.size,
            type: record.avatar.type as BioImageType,
          },
        }),
        cover: new BioImageEntity({
          id: record.coverId,
          props: {
            extension: record.cover.extension,
            size: record.cover.size,
            type: record.cover.type as BioImageType,
          },
        }),
      },
    });
    return entity;
  }
  toResponse(entity: UserEntity): UserResponseDto {
    throw new Error('Method not implemented.');
  }
}
