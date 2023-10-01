import { DomainEvent } from './domain-event.base';
import { Entity } from './entity.base';
import { LoggerPort } from '@lib/common/ports';
import { RequestContextService } from '@lib/common/application';
import { EventBus } from '@nestjs/cqrs';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public async publishEvents(
    logger: LoggerPort,
    eventBus: EventBus
  ): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        logger.debug(
          `[${RequestContextService.getRequestId()}] "${
            event.constructor.name
          }" event published for aggregate ${this.constructor.name} : ${
            this.id
          }`
        );
        return eventBus.publish(event);
      })
    );
    this.clearEvents();
  }
}
