import { Body, Controller, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePostDto } from './update-post.dto';

@Controller('post')
export class UpdateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    body.id = id;
    const result: string = await this.commandBus.execute(body);
    return result;
  }
}
