import { Logger, Module, Provider } from '@nestjs/common';
import { UserRecord, UserRepository } from './infrastructure';
import { UserMapper, UserPrismaMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY } from './user.di-tokens';
import { UserHttpController, UserMessageController } from './presentation';
import {
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  FindUsersQueryHandler,
} from './application';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserPrismaRepository } from './infrastructure/user.prisma.repo';
import { PrismaSampleService } from '@lib/sample-db';

const httpControllers = [UserHttpController];

const messageControllers = [UserMessageController];

const commandHandlers: Provider[] = [
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const mappers: Provider[] = [UserPrismaMapper];

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
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
