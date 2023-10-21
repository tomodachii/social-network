import { Logger, Module, Provider } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY } from './user.di-tokens';
import {
  UserHttpController,
  UserMessageController,
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  FindUsersQueryHandler,
} from './application';
import { UserRepository } from './infrastructure';
import { PrismaSampleService } from '@lib/sample-db';

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
  imports: [CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    PrismaSampleService,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class UserModule {}
