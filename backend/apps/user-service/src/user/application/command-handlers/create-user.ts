import { AggregateID, Command, CommandProps } from '@lib/ddd';
import { Gender, UserEntity, UserRepositoryPort } from '../../domain';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Ok, Result } from 'oxide.ts';
import { AUTH_SERVICE_PROXY, USER_REPOSITORY } from '../../user.di-token';
import { AuthServiceProxyPort } from '@lib/auth-service-proxy';
import { Exception } from '@lib/common/exceptions';
import { CreateUserResponseDto } from '../dtos';

export class CreateUserCommand extends Command {
  readonly email: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly birthDay: Date;
  readonly gender: Gender;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.birthDay = props.birthDay;
    this.gender = props.gender;
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
    @Inject(AUTH_SERVICE_PROXY)
    protected readonly authServiceProxy: AuthServiceProxyPort
  ) {}

  async execute(
    command: CreateUserCommand
  ): Promise<Result<CreateUserResponseDto, Error>> {
    const user = UserEntity.create({
      firstName: command.firstName,
      lastName: command.lastName,
      gender: command.gender,
      birthDay: command.birthDay,
    });

    const credential = await this.authServiceProxy.createCredentials({
      userId: user.id,
      fullName: user.fullName,
      email: command.email,
      password: command.password,
      phoneNumber: command.phoneNumber,
    });

    if (!credential.meta.isSuccess) {
      throw new Exception(
        credential.meta.message.toString(),
        credential.meta.status
      );
    }

    try {
      this.userRepo.insertOne(user);

      return Ok({
        token: credential.data.token,
        refreshToken: credential.data.refreshToken,
        expired: credential.data.expired,
        userId: user.id,
      });
    } catch (error: any) {
      // Todos rollback
      await this.authServiceProxy.rollbackSaveCredential(user.id);
      throw error;
    }
  }
}
