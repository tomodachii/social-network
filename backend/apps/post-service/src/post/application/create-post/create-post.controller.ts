import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from './create-post.dto';
import { Result, match } from 'oxide.ts';
import { BaseResponse } from '@lib/common/api';

@Controller('posts')
export class CreatePostController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() body: CreatePostDto) {
    const result: Result<string, Error> = await this.commandBus.execute(body);
    return match(result, {
      Ok: (response: string) => new BaseResponse<string>(response),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
