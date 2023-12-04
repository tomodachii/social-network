import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';
import { Result } from 'oxide.ts';
import { RequestContextService } from '@lib/common/application';

export class DeleteCommentCommand implements ICommand {
  constructor(
    public readonly postId: string,
    public readonly commentId: string
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly repo: PostRepositoryPort
  ) {}

  async execute(
    command: DeleteCommentCommand
  ): Promise<Result<boolean, Error>> {
    const postOption = await this.repo.findPostById(command.postId);
    if (postOption.isNone()) {
      throw new Exception('Cannot find post', HttpStatus.BAD_REQUEST);
    }
    const post = postOption.unwrap();
    const userId = RequestContextService.getUserId();

    const removedComment = post.getComment(command.commentId);

    if (post.userId !== userId || removedComment.userId !== userId) {
      throw new Exception(
        'You are not allowed to delete this comment',
        HttpStatus.FORBIDDEN
      );
    }
    post.removeComment(command.commentId);

    const result = await Result.safe(this.repo.savePost(post));

    return result;
  }
}
