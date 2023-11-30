import { Module, Provider, Logger } from '@nestjs/common';
import { PostMapper } from './post.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database';
import {
  CreatePostCommandHandler,
  CreateUserController,
  DeletePostCommandHandler,
  DeletePostController,
  UpdatePostCommandHandler,
  UpdateUserController,
} from './application';
import { PostRepository } from './infrastructure';
import { POST_REPOSITORY } from './post.di-token';

const httpControllers = [
  CreateUserController,
  UpdateUserController,
  DeletePostController,
];

// const messageControllers = [UserMessageController];

const commandHandlers: Provider[] = [
  CreatePostCommandHandler,
  UpdatePostCommandHandler,
  DeletePostCommandHandler,
];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [PostMapper];

const repositories: Provider[] = [
  {
    provide: POST_REPOSITORY,
    useClass: PostRepository,
  },
];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [...httpControllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class PostModule {}
