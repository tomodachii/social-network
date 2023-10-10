import { Mapper } from '@lib/ddd';
import { UserEntity, AddressVO, UserRoles } from './domain';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './application';
import { UserRecord } from '@prisma/client/sample';

/**
 * Mapper constructs objects that are used in different layers:
 * Record is an object that is stored in a database,
 * Entity is an object that is used in application domain layer,
 * and a ResponseDTO is an object returned to a user (usually as json).
 */

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserRecord, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserRecord {
    const copy = entity.getPropsCopy();
    const record: UserRecord = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      email: copy.email,
      country: copy.address.country,
      postalCode: copy.address.postalCode,
      street: copy.address.street,
      role: copy.role,
    };
    return record;
  }

  toDomain(record: UserRecord): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: record.email,
        role: record.role as UserRoles,
        address: new AddressVO({
          street: record.street,
          postalCode: record.postalCode,
          country: record.country,
        }),
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getPropsCopy();
    const response = new UserResponseDto(entity);
    response.email = props.email;
    response.country = props.address.country;
    response.postalCode = props.address.postalCode;
    response.street = props.address.street;
    return response;
  }

  /* ^ Data returned to the user is whitelisted to avoid leaks.
     If a new property is added, like password or a
     credit card number, it won't be returned
     unless you specifically allow this.
     (avoid blacklisting, which will return everything
      but blacklisted items, which can lead to a data leak).
  */
}
