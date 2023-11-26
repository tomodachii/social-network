import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  PrismaClient,
  PostRecord,
  AttachmentRecord,
  CommentRecord,
  ReactRecord,
} from '@prisma/client/post';

export * from '@prisma/client/post';

export type CommentPersistent = CommentRecord & {
  reacts: ReactRecord[];
  attachments: AttachmentRecord[];
  replies: CommentPersistent[];
};

export type PostPrersistent = PostRecord & {
  attachments: AttachmentRecord[];
  comments: CommentPersistent[];
  reacts: ReactRecord[];
} & { version?: number };

@Injectable()
export class PrismaPostService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaPostService.name);
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
