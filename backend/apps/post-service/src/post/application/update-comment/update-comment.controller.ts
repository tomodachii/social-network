import { Body, Controller, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentDto } from './update-comment.dto';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/common/api';

@Controller('posts')
export class UpdateCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put(':postId/comments/:commentId')
  async updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentDto
  ) {
    body.postId = postId;
    body.commentId = commentId;
    const result: Result<string, Error> = await this.commandBus.execute(body);
    return match(result, {
      Ok: (response: string) => new BaseResponse<string>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
