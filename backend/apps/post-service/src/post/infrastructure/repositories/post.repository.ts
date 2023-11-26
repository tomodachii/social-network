import { PostPrersistent, PrismaPostService } from './../../../database';
import { BaseRepository } from '@lib/common/databases';
import { Injectable, Logger } from '@nestjs/common';
import { PostEntity, CommentEntity } from '../../domain';
import { PostRepositoryPort } from '../../domain';
import { PostRecord } from '@prisma/client/post';
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
            attachments: true,
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
    const postRecord = this.mapper.toPersistence(post);
    const result = await this.prisma.postRecord.create({
      data: postRecord,
    });
    return !!result;
  }
  savePost(post: PostEntity): Promise<boolean> {
    throw new Error('Method not implemented.');
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
