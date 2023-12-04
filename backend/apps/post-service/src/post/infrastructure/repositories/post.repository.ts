import {
  AttachmentRecord,
  CommentPersistent,
  CommentRecord,
  PostPrersistent,
  PostRecord,
  PrismaPostService,
} from './../../../database';
import { BaseRepository } from '@lib/common/databases';
import { Injectable, Logger } from '@nestjs/common';
import { PostEntity, CommentEntity, AttachmentEntity } from '../../domain';
import { PostRepositoryPort } from '../../domain';
import { EventBus } from '@nestjs/cqrs';
import { PostMapper } from '../../post.mapper';
import { Ok, Option, Result } from 'oxide.ts';

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

  async findPostById(id: string): Promise<Option<PostEntity>> {
    const postRecord = (await this.prisma.postRecord.findUnique({
      where: { id: id },
      include: {
        comments: {
          include: {
            reacts: true,
            attachments: true,
            replies: true,
          },
        },
        reacts: true,
        attachments: true,
      },
    })) as PostPrersistent;
    // return Option.safe(() => this.mapper.toDomain(postRecord));
    const result = this.mapper.toDomain(postRecord);
    return Option.safe(() => result);
  }
  async createPost(post: PostEntity): Promise<boolean> {
    const postPersistent = this.mapper.toPersistence(post);
    const attachments = postPersistent['attachments'];

    const result = await this.prisma.postRecord.create({
      data: {
        id: postPersistent.id,
        content: postPersistent.content,
        mode: postPersistent.mode,
        userId: postPersistent.userId,
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
    const attachments = postPersistent['attachments'] as AttachmentRecord[];
    const comments = postPersistent['comments'] as CommentPersistent[];
    console.log(postPersistent);
    const result = await this.prisma.postRecord.update({
      where: { id: postPersistent.id },
      data: {
        content: postPersistent.content,
        mode: postPersistent.mode,
        version: postPersistent.version + 1,
        attachments: {
          upsert: attachments.map((attachment) => ({
            where: { id: attachment.id },
            create: {
              description: attachment.description,
              name: attachment.name,
              size: attachment.size,
              type: attachment.type,
            },
            update: {
              description: attachment.description,
              name: attachment.name,
              size: attachment.size,
              type: attachment.type,
            },
          })),
          deleteMany: {
            id: {
              notIn: attachments.map((attachment) => attachment.id),
            },
          },
        },
        comments: {
          upsert: comments.map((comment) => ({
            where: { id: comment.id },
            create: {
              content: comment.content,
              userId: comment.userId,
              // postId: postPersistent.id,
              attachments: {
                create: comment.attachments.map((attachment) => ({
                  description: attachment.description,
                  name: attachment.name,
                  size: attachment.size,
                  type: attachment.type,
                })),
              },
            },
            update: {
              content: comment.content,
              attachments: {
                upsert: comment.attachments.map((attachment) => ({
                  where: { id: attachment.id },
                  create: {
                    description: attachment.description,
                    name: attachment.name,
                    size: attachment.size,
                    type: attachment.type,
                  },
                  update: {
                    description: attachment.description,
                    name: attachment.name,
                    size: attachment.size,
                    type: attachment.type,
                  },
                })),
                deleteMany: {
                  id: {
                    notIn: comment.attachments.map(
                      (attachment) => attachment.id
                    ),
                  },
                },
              },
            },
          })),
          deleteMany: {
            id: {
              notIn: comments.map((comment) => comment.id),
            },
          },
        },
      },
      // include: {
      //   attachments: true,
      //   comments: {
      //     include: {
      //       replies: true,
      //       attachments: true,
      //     },
      //   },
      // },
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
  async checkExistAttachmentsByIds(ids: string[]): Promise<boolean> {
    const result = await this.prisma.attachmentRecord.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return result.length > 0;
  }
}
