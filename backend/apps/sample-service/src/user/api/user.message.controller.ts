import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { IdResponse } from '@lib/common/api';
<<<<<<<< HEAD:backend/apps/sample-service/src/user/application/api/user.message.controller.ts
import { CreateUserCommand, CreateUserRequestDto } from '..';
========
import { CreateUserCommand, CreateUserRequestDto } from '../application';
>>>>>>>> dca4cdd78e674d122ba2f747fd205aa1ca07619c:backend/apps/sample-service/src/user/api/user.message.controller.ts

@Controller()
export class UserMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('user.create') // <- Subscribe to a microservice message
  async create(message: CreateUserRequestDto): Promise<IdResponse> {
    const command = new CreateUserCommand(message);

    const id = await this.commandBus.execute(command);

    return new IdResponse(id.unwrap());
  }
}
