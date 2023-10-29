import { HttpService } from '@nestjs/axios';
import { CreateCredentialDto } from '../dtos';
import { AuthServiceProxyPort } from '../auth-service-proxy.port';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpAuthServiceProxy implements AuthServiceProxyPort {
  constructor(private readonly httpService: HttpService) {}
  createCredentials(credential: CreateCredentialDto): Promise<AxiosResponse> {
    // return firstValueFrom(this.httpService.post('/credentials', credential));
    return Promise.resolve({ data: true } as AxiosResponse);
  }
}
