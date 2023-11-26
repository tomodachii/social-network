import { RequestContext } from 'nestjs-request-context';

/**
 * Setting some isolated context for each request.
 */

export class AppRequestContext extends RequestContext {
  requestId!: string;
  userId!: string;
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static setUserId(id: string): void {
    const ctx = this.getContext();
    ctx.userId = id;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static getUserId(): string {
    return this.getContext().userId;
  }
}
