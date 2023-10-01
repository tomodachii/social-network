import { DomainEvent, DomainEventProps } from '@lib/ddd';
import { UserRoles } from '../user.types';

export class UserRoleChangedDomainEvent extends DomainEvent {
  readonly oldRole: UserRoles;

  readonly newRole: UserRoles;

  constructor(props: DomainEventProps<UserRoleChangedDomainEvent>) {
    super(props);
    this.oldRole = props.oldRole;
    this.newRole = props.newRole;
  }
}
