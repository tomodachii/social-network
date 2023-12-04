import { Exception } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';

export class UserAlreadyExistsError extends Exception {
  static readonly message = 'UserEntity already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyExistsError.message, HttpStatus.CONFLICT, cause, metadata);
  }
}
