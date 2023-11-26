import {
  AuthServiceProxyModule,
  MockAuthServiceProxy,
  HttpAuthServiceProxy,
} from '@lib/auth-service-proxy';
import { Module, Provider, Logger } from '@nestjs/common';
import { UserController } from './application/api';
import {
  CreateUserCommandHandler,
  UpdateAvatarCommandHandler,
  UpdateCoverCommandHandler,
  FindUserByIdQueryHandler,
} from './application';
import { UserMapper } from './user.mapper';
import { AUTH_SERVICE_PROXY, USER_REPOSITORY } from './user.di-token';
import { UserRepository } from './infrastructure';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database';

const httpControllers = [UserController];

// const messageControllers = [UserMessageController];

const commandHandlers: Provider[] = [
  CreateUserCommandHandler,
  UpdateAvatarCommandHandler,
  UpdateCoverCommandHandler,
];

const queryHandlers: Provider[] = [FindUserByIdQueryHandler];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: AUTH_SERVICE_PROXY, useClass: HttpAuthServiceProxy },
];

@Module({
  imports: [CqrsModule, DatabaseModule, AuthServiceProxyModule],
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class UserModule {}
