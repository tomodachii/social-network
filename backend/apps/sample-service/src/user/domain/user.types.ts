import { AddressVO } from './value-objects';

// All properties that a UserEntity has
export interface UserProps {
  role: UserRoles;
  email: string;
  address: AddressVO;
}

// Properties that are needed for a user creation
export interface CreateUserProps {
  email: string;
  address: AddressVO;
}

// Properties used for updating a user address
export interface UpdateUserAddressProps {
  country?: string;
  postalCode?: string;
  street?: string;
}

export enum UserRoles {
  admin = 'admin',
  moderator = 'moderator',
  guest = 'guest',
}
