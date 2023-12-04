import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  ContextInterceptor,
  ExceptionInterceptor,
} from '@lib/common/application';
import { RequestContextModule } from 'nestjs-request-context';
import { DatabaseModule, PrismaPostService } from './database';
import { PostModule } from './post';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  // {
  //   provide: APP_INTERCEPTOR,
  //   useClass: ExceptionInterceptor,
  // },
];

@Module({
  imports: [
    RequestContextModule,
    CqrsModule,
    DatabaseModule,
    // Modules
    PostModule,
  ],
  controllers: [],
  providers: [...interceptors, PrismaPostService],
})
export class AppModule {}
