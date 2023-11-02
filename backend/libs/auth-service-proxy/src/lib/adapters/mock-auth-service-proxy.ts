import {
  CreateCredentialPayload,
  CreateCredentialResponse,
} from '../interfaces';
import { AuthServiceProxyPort } from '../auth-service-proxy.port';
import { Injectable } from '@nestjs/common';
import { BaseResponse } from '@lib/common/api';

@Injectable()
export class MockAuthServiceProxy implements AuthServiceProxyPort {
  createCredentials(
    credential: CreateCredentialPayload
  ): Promise<BaseResponse<CreateCredentialResponse>> {
    // return firstValueFrom(this.httpService.post('/credentials', credential));
    return Promise.resolve(
      new BaseResponse<CreateCredentialResponse>({
        token: 'token',
        refreshToken: 'refreshToken',
        expired: 1,
      })
    );
    // return new Observable<BaseResponse<string>>((subscriber) => {
    //   subscriber.next(new BaseResponse<string>('token' as string));
    //   subscriber.complete();
    // });
  }

  rollbackSaveCredential(userId: string): Promise<BaseResponse<boolean>> {
    return Promise.resolve(new BaseResponse<boolean>(true));
  }
}
