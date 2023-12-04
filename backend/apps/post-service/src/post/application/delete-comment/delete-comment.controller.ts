import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/common/api';
import { DeleteCommentCommand } from './delete-comment.command-handler';

@Controller('posts')
export class DeleteCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':postId/comments/:commentId')
  async create(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string
  ) {
    const deleteCommentDto = new DeleteCommentCommand(postId, commentId);
    const result: Result<boolean, Error> = await this.commandBus.execute(
      deleteCommentDto
    );
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
