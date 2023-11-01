import { HttpStatus } from '@nestjs/common';
import { Exception } from '@lib/common/exceptions';

export class UserAlreadyExistsError extends Exception {
  static readonly message = 'UserEntity already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyExistsError.message, HttpStatus.CONFLICT, cause, metadata);
  }
}
