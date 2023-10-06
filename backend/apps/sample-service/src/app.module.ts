import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  ContextInterceptor,
  ExceptionInterceptor,
} from '@lib/common/application';
import { RequestContextModule } from 'nestjs-request-context';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

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

    // Modules
    UserModule,
    WalletModule,
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
