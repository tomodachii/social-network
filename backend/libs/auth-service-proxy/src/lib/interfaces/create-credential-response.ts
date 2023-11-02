export interface CreateCredentialResponse {
  token: string;

  refreshToken: string;

  expired: number;
}
