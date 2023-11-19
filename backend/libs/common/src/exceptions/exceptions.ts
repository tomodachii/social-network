import { HttpStatus } from '@lib/common/api';
import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '.';
import { Exception } from './exception.base';

/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {Exception}
 */
export class ArgumentInvalidException extends Exception {
  override readonly code = ARGUMENT_INVALID;
}

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 *
 * @class ArgumentNotProvidedException
 * @extends {Exception}
 */
export class ArgumentNotProvidedException extends Exception {
  override readonly code = ARGUMENT_NOT_PROVIDED;
}

/**
 * Used to indicate that an argument is out of allowed range
 * (for example: incorrect string/array length, number not in allowed min/max range etc)
 *
 * @class ArgumentOutOfRangeException
 * @extends {Exception}
 */
export class ArgumentOutOfRangeException extends Exception {
  override readonly code = ARGUMENT_OUT_OF_RANGE;
}

/**
 * Used to indicate conflicting entities (usually in the database)
 *
 * @class ConflictException
 * @extends {Exception}
 */
export class ConflictException extends Exception {
  override readonly code = CONFLICT;
}

/**
 * Used to indicate that entity is not found
 *
 * @class NotFoundException
 * @extends {Exception}
 */
export class NotFoundException extends Exception {
  static readonly message = 'Not found';

  constructor(
    message = NotFoundException.message,
    status = HttpStatus.NOT_FOUND
  ) {
    super(message, status);
  }

  override readonly code = NOT_FOUND;
}

/**
 * Used to indicate that entity is not found
 *
 * @class NotFoundException
 * @extends {Exception}
 */
export class InternalServerErrorException extends Exception {
  static readonly message = 'Internal server error';

  constructor(
    message = InternalServerErrorException.message,
    status = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }

  override readonly code = INTERNAL_SERVER_ERROR;
}
