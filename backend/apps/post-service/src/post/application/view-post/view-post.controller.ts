import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ViewPostQuery } from './view-post.query-handler';

@Controller('posts')
export class ViewPostController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const result = await this.queryBus.execute(new ViewPostQuery(id));
    return result;
  }
}
