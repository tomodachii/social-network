import { Module } from '@nestjs/common';
import { PrismaUserService } from './prisma.user.service';

@Module({
  providers: [PrismaUserService],
  exports: [PrismaUserService],
})
export class DatabaseModule {}
