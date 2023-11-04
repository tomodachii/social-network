import { Expose } from 'class-transformer';

export class CreateUserResponseDto {
  @Expose()
  token: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expired: number;

  @Expose()
  userId: string;
}
