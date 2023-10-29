import { ExceptionBase } from '@lib/common/exceptions';

export class UserAlreadyExistsError extends ExceptionBase {
  static readonly message = 'UserEntity already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyExistsError.message, cause, metadata);
  }
}
