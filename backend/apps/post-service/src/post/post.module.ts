import { Module, Provider, Logger } from '@nestjs/common';
import { PostMapper } from './post.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database';
import {
  AddCommentCommandHandler,
  AddCommentController,
  CreatePostCommandHandler,
  CreatePostController,
  DeleteCommentCommandHandler,
  DeleteCommentController,
  DeletePostCommandHandler,
  DeletePostController,
  UpdateCommentCommandHandler,
  UpdateCommentController,
  UpdatePostCommandHandler,
  UpdatePostController,
  ViewPostController,
  ViewPostQueryHandler,
} from './application';
import { PostRepository } from './infrastructure';
import { POST_REPOSITORY } from './post.di-token';

const httpControllers = [
  CreatePostController,
  UpdatePostController,
  DeletePostController,
  ViewPostController,
  AddCommentController,
  UpdateCommentController,
  DeleteCommentController,
];

// const messageControllers = [UserMessageController];

const commandHandlers: Provider[] = [
  CreatePostCommandHandler,
  UpdatePostCommandHandler,
  DeletePostCommandHandler,
  AddCommentCommandHandler,
  UpdateCommentCommandHandler,
  DeleteCommentCommandHandler,
];

const queryHandlers: Provider[] = [ViewPostQueryHandler];

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
