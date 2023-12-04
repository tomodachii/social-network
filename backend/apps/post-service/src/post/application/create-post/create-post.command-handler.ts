import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from './create-post.dto';
import { AttachmentEntity, PostEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { RequestContextService } from '@lib/common/application';
import { Err, Ok, Result } from 'oxide.ts';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';

@CommandHandler(CreatePostDto)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostDto>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepositoryPort
  ) {}

  async execute(command: CreatePostDto): Promise<Result<string, Error>> {
    const post = PostEntity.create({
      content: command.content,
      mode: command.mode,
      attachments: [],
      userId: RequestContextService.getUserId(),
    });

    const isExistAttachments = await this.repo.checkExistAttachmentsByIds(
      command.attachments.map((attachment) => attachment.id)
    );

    if (isExistAttachments) {
      return Err(
        new Exception(
          'Attachments belong to other post',
          HttpStatus.BAD_REQUEST
        )
      );
    }

    for (let attachment of command.attachments) {
      post.addAttachment({
        description: attachment.description,
        type: attachment.type,
        id: attachment.id,
        name: attachment.name,
        size: attachment.size,
      });
    }

    const result = await Result.safe(this.repo.createPost(post));

    if (result.isErr()) {
      return result;
    }

    return Ok(post.id);
  }
}
