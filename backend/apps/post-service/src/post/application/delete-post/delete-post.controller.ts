import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePostDto } from './delete-post.command-handler';

@Controller('posts')
export class DeletePostController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':id')
  async create(@Param('id') id: string) {
    console.log(id);
    const deletePostDto: DeletePostDto = {
      id,
    };
    const result: string = await this.commandBus.execute(deletePostDto);
    return result;
  }
}
