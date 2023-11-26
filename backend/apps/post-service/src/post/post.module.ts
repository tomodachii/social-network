import { Module, Provider, Logger } from '@nestjs/common';
import { PostMapper } from './post.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database/database.module';

const httpControllers = [];

// const messageControllers = [UserMessageController];

const commandHandlers: Provider[] = [];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [PostMapper];

const repositories: Provider[] = [];

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
