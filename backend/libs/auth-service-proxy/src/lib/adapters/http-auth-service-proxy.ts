import {
  CreateCredentialPayload,
  CreateCredentialResponse,
} from '../interfaces';
import { AuthServiceProxyPort } from '../auth-service-proxy.port';
import { Injectable } from '@nestjs/common';
/* The line `import { BaseResponse } from '@lib/common/api';` is importing the `BaseResponse` class
from the `@lib/common/api` module. This class is likely used to wrap the response data returned from
API calls and provide additional information such as status codes and error messages. */
import { BaseResponse } from '@lib/common/api';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class HttpAuthServiceProxy implements AuthServiceProxyPort {
  constructor(private httpService: HttpService) {}

  async createCredentials(
    credential: CreateCredentialPayload
  ): Promise<BaseResponse<CreateCredentialResponse>> {
    const result: AxiosResponse<BaseResponse<CreateCredentialResponse>> =
      await firstValueFrom(
        this.httpService.post(
          'http://localhost:3001/create-credential',
          credential
        )
      );
    return Promise.resolve(
      new BaseResponse<CreateCredentialResponse>(result.data.data)
    );
  }

  rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>> {
    return Promise.resolve(new BaseResponse<boolean>(true));
  }
}
