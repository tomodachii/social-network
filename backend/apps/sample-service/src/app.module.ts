import { MikroOrmModule } from '@mikro-orm/nestjs';
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
import { UserRecord } from './user/infrastructure';
import { WalletRecord } from './wallet/infrastructure';

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
    // MikroOrmModule.forRoot({
    //   entities: [UserRecord, WalletRecord],
    //   dbName: 'test_db',
    //   host: 'localhost',
    //   user: 'root',
    //   password: '123456',
    //   type: 'mysql',
    //   port: 3306,
    //   debug: true,
    // }),
    CqrsModule,

    // Modules
    UserModule,
    WalletModule,
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
