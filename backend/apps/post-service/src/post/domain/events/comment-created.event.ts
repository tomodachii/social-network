import { AggregateID, DomainEvent, DomainEventProps } from '@lib/ddd';
import { AttachmentEntity } from '../entities';

export class CommentCreatedEvent extends DomainEvent {
  readonly content: string;
  readonly userId: AggregateID;
  readonly attachments: AttachmentEntity[];
  readonly replyTo?: AggregateID;

  constructor(props: DomainEventProps<CommentCreatedEvent>) {
    super(props);
    this.content = props.content;
    this.userId = props.userId;
    this.attachments = props.attachments;
    this.replyTo = props.replyTo;
  }
}
