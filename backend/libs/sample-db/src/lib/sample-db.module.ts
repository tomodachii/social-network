import { Module } from '@nestjs/common';
import { PrismaSampleService } from './prisma.service';

@Module({
  controllers: [],
  providers: [PrismaSampleService],
  exports: [PrismaSampleService],
})
export class SampleDbModule {}
export { User, UserRoles, Wallet } from '@prisma/client/sample';
export * from './prisma.service';
