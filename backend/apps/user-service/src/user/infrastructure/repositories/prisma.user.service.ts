import { Injectable, OnModuleInit } from '@nestjs/common';
import { BioImageRecord, PrismaClient, UserRecord } from '@prisma/client/user';

export * from '@prisma/client/user';
export type UserPrersistent = UserRecord & {
  avatar: BioImageRecord;
  cover: BioImageRecord;
};

@Injectable()
export class PrismaUserService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
