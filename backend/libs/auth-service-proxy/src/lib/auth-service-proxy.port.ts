import { AxiosResponse } from 'axios';
import { CreateCredentialDto } from './dtos';

export interface AuthServiceProxyPort {
  createCredentials(
    credential: CreateCredentialDto
  ): Promise<AxiosResponse<string>>;
}
