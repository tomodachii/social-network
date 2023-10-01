import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@lib/common/api';
import { UserResponseDto } from './user.response.dto';

export class UserPaginatedResponseDto extends PaginatedResponseDto<UserResponseDto> {
  @ApiProperty({ type: UserResponseDto, isArray: true })
  readonly data: readonly UserResponseDto[];

  constructor(data: PaginatedResponseDto<UserResponseDto>) {
    super(data);
  }
}
