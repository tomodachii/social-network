import { Module } from '@nestjs/common';
import { PrismaPostService } from './prisma.post.service';

@Module({
  providers: [PrismaPostService],
  exports: [PrismaPostService],
})
export class DatabaseModule {}
