import { Inject } from '@nestjs/common';
import { AttachmentEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { CommandHandler } from '@nestjs/cqrs';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';
import { RequestContextService } from '@lib/common/application';
import { Result } from 'oxide.ts';
import { UpdateCommentDto } from './update-comment.dto';

@CommandHandler(UpdateCommentDto)
export class UpdateCommentCommandHandler {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepositoryPort
  ) {}
  async execute(command: UpdateCommentDto) {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      throw new Exception('Cannot find post', HttpStatus.BAD_REQUEST);
    }
    const post = postOption.unwrap();

    const attachments =
      command.attachments?.map((attachment) =>
        AttachmentEntity.create(attachment)
      ) || [];

    post.updateComment(command.commentId, {
      content: command.content,
      userId: RequestContextService.getUserId(),
      attachments: attachments,
    });

    const result = await Result.safe(this.repo.savePost(post));

    return result;
  }
}
