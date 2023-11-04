import { Command, CommandProps } from '@lib/ddd';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { USER_REPOSITORY } from '../../user.di-token';
import { UserNotFoundError, UserRepositoryPort } from '../../domain';
import { Inject } from '@nestjs/common';

export class UpdateAvatarCommand extends Command {
  readonly id: string;
  readonly userId: string;
  readonly extension: string;
  readonly size: number;

  constructor(props: CommandProps<UpdateAvatarCommand>) {
    super(props);
    this.id = props.id;
    this.userId = props.userId;
    this.extension = props.extension;
    this.size = props.size;
  }
}

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarCommandHandler implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort
  ) {}

  async execute(command: UpdateAvatarCommand): Promise<boolean> {
    const userResult = await this.userRepo.findById(command.userId);

    if (userResult.isNone()) {
      throw new UserNotFoundError();
    }
    const user = userResult.unwrap();

    user.updateAvatar({
      id: command.id,
      extension: command.extension,
      size: command.size,
    });

    return await this.userRepo.updateAvatar(user);
  }
}
