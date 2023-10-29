import { Module } from '@nestjs/common';
import { HttpAuthServiceProxy } from './adapters';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [HttpAuthServiceProxy],
  exports: [HttpModule, HttpAuthServiceProxy],
})
export class AuthServiceProxyModule {}
