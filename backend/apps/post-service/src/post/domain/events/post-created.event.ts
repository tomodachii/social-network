import { AggregateID, DomainEvent, DomainEventProps } from '@lib/ddd';
import { AttachmentEntity } from '../entities';
import { PostMode } from '../post.type';

export class PostCreatedEvent extends DomainEvent {
  readonly content: string;
  readonly userId: AggregateID;
  readonly attachments: AttachmentEntity[];
  readonly mode: PostMode;
  readonly originalPost: AggregateID;

  constructor(props: DomainEventProps<PostCreatedEvent>) {
    super(props);
    this.content = props.content;
    this.userId = props.userId;
    this.attachments = props.attachments;
    this.mode = props.mode;
    this.originalPost = props.originalPost;
  }
}
