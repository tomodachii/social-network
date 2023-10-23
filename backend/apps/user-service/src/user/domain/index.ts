import { UserEntity } from './user.entity';
import { Gender } from './user.type';

export * from './entities';
export * from './user.entity';
export * from './user.type';
export * from './value-objects';
export * from './ports';

const user = new UserEntity({
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  props: {
    firstName: 'John',
    lastName: 'Doe',
    gender: Gender.FEMALE,
  },
});

user.firstName = null;
