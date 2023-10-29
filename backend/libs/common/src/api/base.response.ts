import { ApiProperty } from '@nestjs/swagger';

interface ResponseMetaData {
  message: string;
  serviceId: string;
  extraMeta: any;
}

export class BaseResponse<T> {
  @ApiProperty()
  meta: ResponseMetaData;

  @ApiProperty()
  data: T;

  constructor(
    data: T,
    meta: ResponseMetaData = { message: '', serviceId: '', extraMeta: {} }
  ) {
    this.data = data;
    this.meta = meta;
  }
}
