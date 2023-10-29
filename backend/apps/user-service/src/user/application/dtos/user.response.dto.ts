import { Expose, Transform } from 'class-transformer';

class AddressDto {
  @Expose()
  city: string;

  @Expose()
  postalCode: string;
}

class BioImageDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  extension: string;

  @Expose()
  size: number;
}

class ConfigDto {}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  fullName?: string;

  @Expose()
  gender: string;

  @Expose()
  bio?: string;

  @Expose()
  birthDay?: Date;

  @Expose()
  @Transform(() => AddressDto)
  address?: AddressDto;

  @Expose()
  avatar?: BioImageDto;

  @Expose()
  cover?: BioImageDto;

  @Expose()
  config?: ConfigDto;
}
