import { Body, Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from './create-post.dto';

@Controller('post')
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}
  async create(@Body() body: CreatePostDto) {
    const result: string = await this.commandBus.execute(body);
    return result;
  }
}
