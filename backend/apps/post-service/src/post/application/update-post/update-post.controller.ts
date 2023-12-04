import { Body, Controller, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePostDto } from './update-post.dto';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/common/api';

@Controller('posts')
export class UpdatePostController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    body.id = id;
    const result: Result<boolean, Error> = await this.commandBus.execute(body);
    return match(result, {
      Ok: (response: boolean) => new BaseResponse<boolean>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
