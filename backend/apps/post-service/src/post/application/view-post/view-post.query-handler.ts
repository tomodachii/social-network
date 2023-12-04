import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPostService } from 'apps/post-service/src/database';
export class ViewPostQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(ViewPostQuery)
export class ViewPostQueryHandler implements IQueryHandler<ViewPostQuery> {
  constructor(private readonly prisma: PrismaPostService) {}
  async execute(query: ViewPostQuery) {
    return await this.prisma.postRecord.findUnique({
      where: {
        id: query.id,
      },
      select: {
        content: true,
        mode: true,
        createdAt: true,
        updatedAt: true,
        id: true,
        _count: {
          select: {
            comments: true,
            reacts: true,
          },
        },
        version: false,
        comments: {
          skip: 0,
          take: 5,
          select: {
            content: true,
            createdAt: true,
            id: true,
            updatedAt: true,
            _count: {
              select: {
                reacts: true,
              },
            },
            user: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatarFileId: true,
              },
            },
          },
        },
        reacts: true,
        attachments: true,
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatarFileId: true,
          },
        },
        originalPost: true,
      },
    });
  }
}
