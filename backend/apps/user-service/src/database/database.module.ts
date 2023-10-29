import { Module } from '@nestjs/common';
import { PrismaUserService } from './prisma.user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaUserService],
})
export class DatabaseModule {}
