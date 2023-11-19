import { AggregateID, AggregateRoot } from '@lib/ddd';
import { Guard } from '@lib/common/utils';
import { ArgumentNotProvidedException } from '@lib/common/exceptions';
import { v4 } from 'uuid';
import { HttpStatus } from '@lib/common/api';
import { ReactVO } from '../value-objects/react.vo';
import { AttachmentEntity } from './attachment.entity';

export interface CommentProps {
  content: string;
  reacts: ReactVO[];
  userId: AggregateID;
  attachments: AttachmentEntity[];
  replyTo?: AggregateID;
}

export interface CreateCommentProps {
  content: string;
  userId: AggregateID;
  attachments: AttachmentEntity[];
  replyTo?: AggregateID;
}

export class CommentEntity extends AggregateRoot<CommentProps> {
  protected _id: string;

  static create(create: CreateCommentProps): CommentEntity {
    const id = v4();
    const props: CommentProps = {
      ...create,
      reacts: [],
    };
    return new CommentEntity({ id, props });
  }

  get content(): string {
    return this.props.content;
  }

  get reacts(): ReactVO[] {
    return this.props.reacts;
  }

  get userId(): AggregateID {
    return this.props.userId;
  }

  get attachments(): AttachmentEntity[] {
    return this.props.attachments;
  }

  get replyTo(): AggregateID {
    return this.props.replyTo;
  }

  set content(content: string) {
    this.props.content = content;
  }

  addReact(react: ReactVO): void {
    if (this.props.reacts.find((r) => r.userId === react.userId)) {
      throw new ArgumentNotProvidedException(
        'User already reacted',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.reacts.push(react);
  }

  removeReact(userId: AggregateID): void {
    const reactIndex = this.props.reacts.findIndex((r) => r.userId === userId);
    if (reactIndex === -1) {
      throw new ArgumentNotProvidedException(
        'User did not react',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.reacts.splice(reactIndex, 1);
  }

  public validate(): void {
    if (
      Guard.isEmpty(this.props.attachments) &&
      Guard.isEmpty(this.props.content)
    ) {
      throw new ArgumentNotProvidedException(
        'Comment must have content or attachments',
        HttpStatus.BAD_REQUEST
      );
    }
    if (Guard.isEmpty(this.props.userId)) {
      throw new ArgumentNotProvidedException(
        'Comment must belong to one user',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
