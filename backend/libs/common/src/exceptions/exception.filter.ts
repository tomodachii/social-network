import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Exception } from './exception.base';
import { RequestContextService } from '../application';
import { BaseResponse } from '../api';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly serviceName: string
  ) {}

  catch(exception: Exception, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    Logger.debug(
      `[${RequestContextService.getRequestId()}] ${exception.message}: ${
        exception.stack
      }`,
      this.serviceName
    );
    let responseBody: BaseResponse<null>;
    let httpStatus: HttpStatus;
    if (exception?.message) {
      httpStatus = exception.status ? exception.status : HttpStatus.BAD_REQUEST;

      responseBody = {
        meta: {
          isSuccess: false,
          message: [exception.message],
          status: httpStatus,
          serviceId: this.serviceName,
          extraMeta: {},
        },
        data: null,
      };
    } else {
      httpStatus = !isNaN(exception?.status)
        ? exception.status
        : HttpStatus.INTERNAL_SERVER_ERROR;

      responseBody = {
        meta: {
          isSuccess: false,
          message: [exception.message],
          status: httpStatus,
          serviceId: this.serviceName,
          extraMeta: {},
        },
        data: null,
      };
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
