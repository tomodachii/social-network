import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from './update-post.dto';
import { AttachmentEntity, PostEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';
import { RequestContextService } from '@lib/common/application';
import { Err, Result } from 'oxide.ts';

@CommandHandler(UpdatePostDto)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostDto>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepositoryPort
  ) {}

  async execute(command: UpdatePostDto): Promise<Result<boolean, Error>> {
    const postOption = await this.repo.findPostById(command.id);
    if (postOption.isNone()) {
      return Err(new Exception('Cannot find post', HttpStatus.BAD_REQUEST));
    }

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

    const post = postOption.unwrap();

    for (let attachment of post.attachments) {
      post.removeAttachment(attachment.id);
    }
    const attachments = command.attachments;
    for (let attachment of attachments) {
      post.addAttachment({
        description: attachment.description,
        type: attachment.type,
        id: attachment.id,
        name: attachment.name,
        size: attachment.size,
      });
    }

    post.content = command.content;
    post.mode = command.mode;

    const result = await Result.safe(this.repo.savePost(post));

    return result;
  }
}
