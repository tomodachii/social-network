import { AggregateRoot } from '@lib/ddd';
import { Guard } from '@lib/common/utils';
import { ArgumentNotProvidedException } from '@lib/common/exceptions';
import { v4 } from 'uuid';
import { Gender } from './user.type';
import { AddressProps, AddressVO } from './value-objects';
import { ConfigEntity, BioImageEntity, CreateBioImageProps } from './entities';

export interface UserProps {
  firstName: string;
  lastName: string;
  fullName?: string;
  gender: Gender;
  bio?: string;
  dateOfBirth?: Date;
  address?: AddressVO;
  avatar?: BioImageEntity;
  cover?: BioImageEntity;
  config?: ConfigEntity;
}

export interface CreateUserProps {
  firstName: string;
  lastName: string;
  gender: Gender;
}

export class UserEntity extends AggregateRoot<UserProps> {
  protected _id: string;

  static create(create: CreateUserProps): UserEntity {
    const id = v4();
    const props: UserProps = {
      ...create,
    };
    return new UserEntity({ id, props });
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  set firstName(firstName: string) {
    if (Guard.isEmpty(firstName)) {
      throw new ArgumentNotProvidedException('first name must not be empty');
    }
    this.props.firstName = firstName;
  }

  set lastName(lastName: string) {
    if (Guard.isEmpty(lastName)) {
      throw new ArgumentNotProvidedException('last name must not be empty');
    }
    this.props.lastName = lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get gender(): Gender {
    return this.props.gender;
  }

  set gender(gender: Gender) {
    this.props.gender = gender;
  }

  get dateOfBirth(): Date {
    return this.props.dateOfBirth;
  }

  set dateOfBirth(dateOfBirth: Date) {
    this.props.dateOfBirth = dateOfBirth;
  }

  updateAvatar(avatarProps: CreateBioImageProps): void {
    const avatar = BioImageEntity.createAvatar(avatarProps);
    this.props.avatar = avatar;
  }

  updateCover(coverProps: CreateBioImageProps): void {
    const cover = BioImageEntity.createCover(coverProps);
    this.props.cover = cover;
  }

  updateAddress(addressProps: AddressVO): void {
    const newAddress = new AddressVO({
      ...this.props.address,
      ...addressProps,
    } as AddressProps);

    this.props.address = newAddress;
  }

  public validate(): void {
    if (Guard.isEmpty(this.props.firstName)) {
      throw new ArgumentNotProvidedException('first name must not be empty');
    }
    if (Guard.isEmpty(this.props.lastName)) {
      throw new ArgumentNotProvidedException('last name must not be empty');
    }
  }
}
