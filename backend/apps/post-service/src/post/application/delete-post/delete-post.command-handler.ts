import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepositoryPort } from '../../domain';
import { POST_REPOSITORY } from '../../post.di-token';
import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';

export class DeletePostDto {
  id: string;
}

@CommandHandler(DeletePostDto)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostDto>
{
  constructor(
    @Inject(POST_REPOSITORY)
    protected readonly repo: PostRepositoryPort
  ) {}

  async execute(command: DeletePostDto): Promise<string> {
    const post = await this.repo.findPostById(command.id);

    const result = await this.repo.deletePost(post);

    if (!result) {
      throw new Exception('Cannot create post', HttpStatus.BAD_REQUEST);
    }

    return post.id;
  }
}
