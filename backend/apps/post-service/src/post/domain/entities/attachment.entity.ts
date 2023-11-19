import { AggregateID, AggregateRoot } from '@lib/ddd';
import {
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '@lib/common/exceptions';
import { v4 } from 'uuid';
import { HttpStatus } from '@lib/common/api';
import { AttachmentType } from '../post.type';
import { validate as uuidValidate } from 'uuid';

export interface AttachmentProps {
  name: string;
  description: string;
  size: number;
  type: AttachmentType;
}

export interface CreateAttachmentProps {
  id: AggregateID;
  name: string;
  description: string;
  size: number;
  type: AttachmentType;
}

export class AttachmentEntity extends AggregateRoot<AttachmentProps> {
  protected _id: AggregateID;

  static create(create: CreateAttachmentProps): AttachmentEntity {
    const id = v4();
    const props: AttachmentProps = {
      ...create,
    };
    return new AttachmentEntity({ id, props });
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get size(): number {
    return this.props.size;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set size(size: number) {
    this.validate();
    this.props.size = size;
  }

  public validate(): void {
    if (uuidValidate(this._id) === false) {
      throw new ArgumentInvalidException(
        'file id must be uuid',
        HttpStatus.BAD_REQUEST
      );
    }
    if (this.props.size > 5012) {
      throw new ArgumentOutOfRangeException(
        'attachment size must not be greater than 5MB',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}