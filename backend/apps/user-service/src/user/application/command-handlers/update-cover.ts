import { Command, CommandProps } from '@lib/ddd';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { USER_REPOSITORY } from '../../user.di-token';
import { UserNotFoundError, UserRepositoryPort } from '../../domain';
import { Inject } from '@nestjs/common';

export class UpdateCoverCommand extends Command {
  readonly id: string;
  readonly userId: string;
  readonly extension: string;
  readonly size: number;

  constructor(props: CommandProps<UpdateCoverCommand>) {
    super(props);
    this.id = props.id;
    this.userId = props.userId;
    this.extension = props.extension;
    this.size = props.size;
  }
}

@CommandHandler(UpdateCoverCommand)
export class UpdateCoverCommandHandler implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort
  ) {}

  async execute(command: UpdateCoverCommand): Promise<boolean> {
    const userResult = await this.userRepo.findById(command.userId);

    if (userResult.isNone()) {
      throw new UserNotFoundError();
    }

    const user = userResult.unwrap();

    user.updateCover({
      id: command.id,
      extension: command.extension,
      size: command.size,
    });

    return await this.userRepo.updateCover(user);
  }
}
