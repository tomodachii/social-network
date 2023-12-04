import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { nanoid } from 'nanoid';
import { RequestContextService } from './AppRequestContext';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    /**
     * Setting an ID in the global context for each request.
     * This ID can be used as correlation id shown in logs
     */
    const requestId = request?.body?.requestId ?? nanoid(6);
    const userId = request?.user?.id ?? null;

    RequestContextService.setRequestId(requestId);
    RequestContextService.setUserId('30118fc5-665e-4c87-b9c3-8fc246efdf3a');
    // console.log(request?.header('x-username'));

    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      })
    );
  }
}
