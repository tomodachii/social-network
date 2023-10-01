import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID } from '@lib/ddd';
import { ConflictException } from '@lib/common/exceptions';
import { Inject } from '@nestjs/common';
import { Command, CommandProps } from '@lib/ddd';
import { USER_REPOSITORY } from '../../user.di-tokens';
import {
  AddressVO,
  UserAlreadyExistsError,
  UserEntity,
  UserRepositoryPort,
} from '../../domain';

export class CreateUserCommand extends Command {
  readonly email: string;

  readonly country: string;

  readonly postalCode: string;

  readonly street: string;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort
  ) {}

  async execute(
    command: CreateUserCommand
  ): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const user = UserEntity.create({
      email: command.email,
      address: new AddressVO({
        country: command.country,
        postalCode: command.postalCode,
        street: command.street,
      }),
    });

    try {
      /* Wrapping operation in a transaction to make sure
         that all domain events are processed atomically */
      await this.userRepo.transaction(async () => this.userRepo.insert(user));
      return Ok(user.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
