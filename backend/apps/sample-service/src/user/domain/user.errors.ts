import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsError extends Exception {
  static readonly message = 'UserEntity already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyExistsError.message, HttpStatus.CONFLICT, cause, metadata);
  }
}
