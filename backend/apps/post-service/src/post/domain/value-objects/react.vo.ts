import { AggregateID, ValueObject } from '@lib/ddd';
import { ReactType } from '../post.type';

export interface ReactProps {
  type: ReactType;
  createdAt: Date;
  userId: AggregateID;
}

export class ReactVO extends ValueObject<ReactProps> {
  get type(): ReactType {
    return this.props.type;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get userId(): AggregateID {
    return this.props.userId;
  }

  protected validate(props: ReactProps): void {}
}
