import {
  Body,
  Post,
  ConflictException as ConflictHttpException,
  Controller,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos';
import { BaseResponse, IdResponse } from '@lib/common/api';
import { AggregateID } from '@lib/ddd';
import { Result, match } from 'oxide.ts';
import { CreateUserCommand } from '../command-handlers';
import { UserAlreadyExistsError } from '../../domain';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiOperation({ summary: 'Create a user' })
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     type: IdResponse,
  //   })
  @Post()
  async create(@Body() body: CreateUserDto): Promise<BaseResponse<string>> {
    const command = new CreateUserCommand(body);

    const result: Result<AggregateID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    // Deciding what to do with a Result (similar to Rust matching)
    // if Ok we return a response with an id
    // if Error decide what to do with it depending on its type
    return match(result, {
      Ok: (id: string) => new BaseResponse<string>(id),
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
