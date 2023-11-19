import { ValueObject } from '@lib/ddd';
import { Guard } from '@lib/common/utils';
import { ArgumentOutOfRangeException } from '@lib/common/exceptions';
import { HttpStatus } from '@lib/common/api';

/** Note:
 * Value Objects with multiple properties can contain
 * other Value Objects inside if needed.
 * */

export interface AddressProps {
  postalCode: string;
  city: string;
}

export class AddressVO extends ValueObject<AddressProps> {
  get postalCode(): string {
    return this.props.postalCode;
  }

  get city(): string {
    return this.props.city;
  }

  /**
   * Note: This is a very simplified example of validation,
   * real world projects will have stricter rules.
   * You can avoid this type of validation here and validate
   * only on the edge of the application (in controllers when receiving
   * a request) sacrificing some security for performance and convenience.
   */
  protected validate(props: AddressProps): void {
    if (!Guard.lengthIsBetween(props.city, 2, 50)) {
      throw new ArgumentOutOfRangeException(
        'city is out of range',
        HttpStatus.BAD_REQUEST
      );
    }
    if (!Guard.lengthIsBetween(props.postalCode, 2, 10)) {
      throw new ArgumentOutOfRangeException(
        'postalCode is out of range',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
