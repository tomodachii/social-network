import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BioImageRecord, PrismaClient, UserRecord } from '@prisma/client/user';

export * from '@prisma/client/user';
export type UserPrersistent = UserRecord & {
  avatar: BioImageRecord;
  cover: BioImageRecord;
} & { version?: number };

@Injectable()
export class PrismaUserService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaUserService.name);
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'colorless',
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
