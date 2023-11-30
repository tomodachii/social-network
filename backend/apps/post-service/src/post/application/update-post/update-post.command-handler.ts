import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from './update-post.dto';
import { AttachmentEntity, PostEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';
import { RequestContextService } from '@lib/common/application';

@CommandHandler(UpdatePostDto)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostDto>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepositoryPort
  ) {}

  async execute(command: UpdatePostDto): Promise<string> {
    const attachments = command.attachments;

    const post = await this.repo.findPostById(command.id);
    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      post.addAttachment({
        description: attachment.description,
        type: attachment.type,
        id: attachment.id,
        name: attachment.name,
        size: attachment.size,
      });
    }

    const result = await this.repo.savePost(post);

    if (!result) {
      throw new Exception('Cannot update post', HttpStatus.BAD_REQUEST);
    }

    return post.id;
  }
}
