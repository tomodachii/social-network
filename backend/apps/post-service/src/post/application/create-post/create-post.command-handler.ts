import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from './create-post.dto';
import { AttachmentEntity, PostEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';
import { RequestContextService } from '@lib/common/application';

@CommandHandler(CreatePostDto)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostDto>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepositoryPort
  ) {}

  async execute(command: CreatePostDto): Promise<string> {
    const attachments = command.attachments.map((attachment) =>
      AttachmentEntity.create({
        ...attachment,
      })
    );

    const post = PostEntity.create({
      content: command.content,
      mode: command.mode,
      attachments: attachments,
      userId: RequestContextService.getUserId(),
    });

    const result = await this.repo.createPost(post);

    if (!result) {
      throw new Exception('Cannot create post', HttpStatus.BAD_REQUEST);
    }

    return post.id;
  }
}
