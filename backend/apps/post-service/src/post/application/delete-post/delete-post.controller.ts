import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePostCommand } from './delete-post.command-handler';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/common/api';

@Controller('posts')
export class DeletePostController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':id')
  async create(@Param('id') id: string) {
    const deletePostDto = new DeletePostCommand(id);
    const result: Result<boolean, Error> = await this.commandBus.execute(
      deletePostDto
    );
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
