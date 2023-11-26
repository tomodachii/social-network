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
    protected readonly userRepo: PostRepositoryPort
  ) {}

  async execute(command: UpdatePostDto): Promise<string> {
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

    const result = await this.userRepo.savePost(post);

    if (!result) {
      throw new Exception('Cannot update post', HttpStatus.BAD_REQUEST);
    }

    return post.id;
  }
}
