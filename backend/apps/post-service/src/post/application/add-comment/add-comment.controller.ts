import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddCommentDto } from './add-comment.dto';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/common/api';

@Controller('posts')
export class AddCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() body: AddCommentDto) {
    body.postId = id;
    const result: Result<string, Error> = await this.commandBus.execute(body);
    return match(result, {
      Ok: (response: string) => new BaseResponse<string>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
