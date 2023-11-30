import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from './create-post.dto';

@Controller('posts')
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() body: CreatePostDto) {
    const result: string = await this.commandBus.execute(body);
    return result;
  }
}
