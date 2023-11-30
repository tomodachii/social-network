import {
  AttachmentRecord,
  CommentRecord,
  PostPrersistent,
  PostRecord,
  PrismaPostService,
} from './../../../database';
import { BaseRepository } from '@lib/common/databases';
import { Injectable, Logger } from '@nestjs/common';
import { PostEntity, CommentEntity } from '../../domain';
import { PostRepositoryPort } from '../../domain';
import { EventBus } from '@nestjs/cqrs';
import { PostMapper } from '../../post.mapper';

@Injectable()
export class PostRepository
  extends BaseRepository<PostEntity, PostRecord>
  implements PostRepositoryPort
{
  constructor(
    protected readonly mapper: PostMapper,
    protected readonly eventBus: EventBus,
    protected readonly prisma: PrismaPostService,
    protected readonly logger: Logger
  ) {
    super(mapper, eventBus, logger);
  }

  async findPostById(id: string): Promise<PostEntity> {
    const postRecord = (await this.prisma.postRecord.findUnique({
      where: { id: id },
      include: {
        comments: {
          include: {
            reacts: true,
            // attachments: true,
            replies: true,
          },
        },
        reacts: true,
        attachments: true,
      },
    })) as PostPrersistent;
    return this.mapper.toDomain(postRecord);
  }
  async createPost(post: PostEntity): Promise<boolean> {
    const postPersistent = this.mapper.toPersistence(post);
    const attachments = postPersistent['attachments'];

    const result = await this.prisma.postRecord.create({
      data: {
        id: postPersistent.id,
        content: postPersistent.content,
        mode: postPersistent.mode,
        userId: '30118fc5-665e-4c87-b9c3-8fc246efdf3a',
        version: 0,
        attachments: {
          createMany: {
            data: attachments,
            skipDuplicates: true,
          },
        },
      },
      include: {
        attachments: true,
      },
    });
    return !!result;
  }
  async savePost(post: PostEntity): Promise<boolean> {
    const postPersistent = this.mapper.toPersistence(post);
    console.log(post);
    const attachments = postPersistent['attachments'] as AttachmentRecord[];
    // const comments = postPersistent['comments'] as CommentRecord[];

    const comment = {
      id: 'c9b2268b-1a50-4fff-aaeb-ae6812080c9f',
      content: 'hello comment',
      userId: '30118fc5-665e-4c87-b9c3-8fc246efdf3a',
    };
    // const comments: CommentRecord[] = [comment]

    const result = await this.prisma.postRecord.update({
      where: { id: postPersistent.id },
      data: {
        content: postPersistent.content,
        mode: postPersistent.mode,
        version: postPersistent.version + 1,
        attachments: {
          upsert: attachments.map((attachment) => ({
            where: { id: attachment.id },
            create: attachment,
            update: {
              ...attachment,
            },
          })),
        },
        comments: {
          upsert: {
            create: {
              content: comment.content,
              userId: comment.userId,
            },
            update: {
              content: comment.content,
              userId: comment.userId,
            },
            where: {
              id: comment.id,
            },
          },
        },
      },
      include: {
        attachments: true,
        comments: {
          include: {
            replies: true,
          },
        },
      },
    });
    return !!result;
  }
  async deletePost(post: PostEntity): Promise<boolean> {
    const result = await this.prisma.postRecord.delete({
      where: { id: post.id },
    });
    return !!result;
  }
  findCommentById(id: string): Promise<CommentEntity> {
    throw new Error('Method not implemented.');
  }
  // ...
}
