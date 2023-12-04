import {
  Body,
  Post,
  ConflictException as ConflictHttpException,
  Controller,
  Param,
  Put,
  Get,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserResponseDto,
  UpdateBioImageDto,
  UserResponseDto,
} from '../dtos';
import { BaseResponse } from '@lib/common/api';
import { Result, match } from 'oxide.ts';
import {
  CreateUserCommand,
  UpdateAvatarCommand,
  UpdateCoverCommand,
} from '../command-handlers';
import { UserAlreadyExistsError } from '../../domain';
import { FindUserByIdQuery } from '../query-handlers';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiOperation({ summary: 'Create a user' })
  @Post()
  async create(
    @Body() body: CreateUserDto
  ): Promise<BaseResponse<CreateUserResponseDto>> {
    const command = new CreateUserCommand(body);
    const result: Result<CreateUserResponseDto, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateUserResponseDto) =>
        new BaseResponse<CreateUserResponseDto>(response),
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }

  @ApiOperation({ summary: 'Find user by id' })
  @Get(':userId')
  async findById(
    @Param('userId') userId: string
  ): Promise<BaseResponse<UserResponseDto>> {
    const result: Result<UserResponseDto, Error> = await this.queryBus.execute(
      new FindUserByIdQuery(userId)
    );

    return new BaseResponse<UserResponseDto>(result.unwrap());
  }

  @ApiOperation({ summary: 'Update avatar of user' })
  @Put(':userId/avatar')
  async updateAvatar(
    @Param('userId') userId: string,
    @Body() body: UpdateBioImageDto,
  ): Promise<BaseResponse<boolean>> {
    const command = new UpdateAvatarCommand({
      ...body,
      userId: userId,
    });

    const result: boolean = await this.commandBus.execute(command);

    return new BaseResponse<boolean>(result);
  }

  @ApiOperation({ summary: 'Update cover of user' })
  @Put(':userId/cover')
  async updateCover(
    @Param('userId') userId: string,
    @Body() body: UpdateBioImageDto
  ): Promise<BaseResponse<boolean>> {
    const command = new UpdateCoverCommand({
      ...body,
      userId: userId,
    });

    const result: boolean = await this.commandBus.execute(command);

    return new BaseResponse<boolean>(result);
  }
}
