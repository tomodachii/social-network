import { AggregateID, AggregateRoot } from '@lib/ddd';
import { Guard } from '@lib/common/utils';
import { ArgumentNotProvidedException } from '@lib/common/exceptions';
import { v4 } from 'uuid';
import { HttpStatus } from '@lib/common/api';
import { ReactProps, ReactVO } from './value-objects';
import {
  AttachmentEntity,
  CommentEntity,
  CreateAttachmentProps,
  CreateCommentProps,
} from './entities';
import { PostMode } from './post.type';

export interface PostProps {
  content: string;
  reacts: ReactVO[];
  comments: CommentEntity[];
  userId: AggregateID;
  attachments: AttachmentEntity[];
  mode: PostMode;
  originalPost: AggregateID;
}

export interface CreatePostProps {
  content: string;
  userId: AggregateID;
  attachments: AttachmentEntity[];
  mode: PostMode;
  originalPost: AggregateID;
}

export class PostEntity extends AggregateRoot<PostProps> {
  protected _id: string;

  static create(create: CreatePostProps): PostEntity {
    const id = v4();
    const props: PostProps = {
      ...create,
      reacts: [],
      comments: [],
    };
    return new PostEntity({ id, props });
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

  get mode(): PostMode {
    return this.props.mode;
  }

  set content(content: string) {
    this.props.content = content;
  }

  set mode(mode: PostMode) {
    this.props.mode = mode;
  }

  addComment(createCommentProp: CreateCommentProps): void {
    const comment = CommentEntity.create(createCommentProp);
    this.props.comments.push(comment);
  }

  removeComment(commentId: AggregateID): void {
    const commentIndex = this.props.comments.findIndex(
      (c) => c.id === commentId
    );
    if (commentIndex === -1) {
      throw new ArgumentNotProvidedException(
        'Comment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.comments.splice(commentIndex, 1);
  }

  addAttachment(createAttachment: CreateAttachmentProps): void {
    const attachment = AttachmentEntity.create(createAttachment);
    this.props.attachments.push(attachment);
  }

  removeAttachment(attachmentId: AggregateID): void {
    const attachmentIndex = this.props.attachments.findIndex(
      (a) => a.id === attachmentId
    );
    if (attachmentIndex === -1) {
      throw new ArgumentNotProvidedException(
        'Attachment does not exist',
        HttpStatus.BAD_REQUEST
      );
    }
    this.props.attachments.splice(attachmentIndex, 1);
  }

  addReact(reactProp: ReactProps): void {
    if (this.props.reacts.find((r) => r.userId === react.userId)) {
      throw new ArgumentNotProvidedException(
        'User already reacted',
        HttpStatus.BAD_REQUEST
      );
    }
    const react = new ReactVO(reactProp);
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
    if (Guard.isEmpty(this.props.userId) === false) {
      throw new ArgumentNotProvidedException(
        'Post must belong to one user',
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      !Guard.isEmpty(this.props.originalPost) &&
      Guard.isEmpty(this.props.attachments)
    ) {
      throw new ArgumentNotProvidedException(
        'Shared post must not have attachments',
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      Guard.isEmpty(this.props.attachments) &&
      Guard.isEmpty(this.props.content)
    ) {
      throw new ArgumentNotProvidedException(
        'Post must have content or attachments',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
