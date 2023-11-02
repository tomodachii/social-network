import { Module } from '@nestjs/common';
import { MockAuthServiceProxy } from './adapters';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MockAuthServiceProxy],
  exports: [HttpModule, MockAuthServiceProxy],
})
export class AuthServiceProxyModule {}
