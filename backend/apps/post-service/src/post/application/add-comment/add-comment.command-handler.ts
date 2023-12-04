import { Inject } from '@nestjs/common';
import { AttachmentEntity, PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { CommandHandler } from '@nestjs/cqrs';
import { AddCommentDto } from './add-comment.dto';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';
import { RequestContextService } from '@lib/common/application';
import { Ok, Result } from 'oxide.ts';

@CommandHandler(AddCommentDto)
export class AddCommentCommandHandler {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepositoryPort
  ) {}
  async execute(command: AddCommentDto): Promise<Result<string, Error>> {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      throw new Exception('Cannot find post', HttpStatus.BAD_REQUEST);
    }
    const post = postOption.unwrap();

    const attachments =
      command.attachments?.map((attachment) =>
        AttachmentEntity.create(attachment)
      ) || [];

    const commentId = post.addComment({
      content: command.content,
      userId: RequestContextService.getUserId(),
      attachments: attachments,
    });

    const result = await Result.safe(this.repo.savePost(post));
    if (result.isErr()) {
      throw result;
    }

    return Ok(commentId);
  }
}
