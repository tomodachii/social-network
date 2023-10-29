import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  ContextInterceptor,
  ExceptionInterceptor,
} from '@lib/common/application';
import { RequestContextModule } from 'nestjs-request-context';
import { UserModule } from './user/user.module';
import { DatabaseModule, PrismaUserService } from './database';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

@Module({
  imports: [
    RequestContextModule,
    CqrsModule,
    DatabaseModule,
    // Modules
    UserModule,
  ],
  controllers: [],
  providers: [...interceptors, PrismaUserService],
})
export class AppModule {}
