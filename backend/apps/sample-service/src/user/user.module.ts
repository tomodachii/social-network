import { Logger, Module, Provider } from '@nestjs/common';
import { UserRecord, UserRepository } from './infrastructure';
import { UserMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY } from './user.di-tokens';
import { UserHttpController, UserMessageController } from './presentation';
import {
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  FindUsersQueryHandler,
} from './application';
import { MikroOrmModule } from '@mikro-orm/nestjs';

const httpControllers = [UserHttpController];

const messageControllers = [UserMessageController];

const commandHandlers: Provider[] = [
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([UserRecord])],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class UserModule {}
