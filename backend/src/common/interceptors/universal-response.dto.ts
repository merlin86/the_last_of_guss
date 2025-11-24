import { ApiResponseProperty } from '@nestjs/swagger';
import { LogicalErrorFormat, UniversalResponse, UniversalResponseStatus } from '@common/types';
import { type Nullable } from '@common/utils/typeguards';

export class UniversalResponseDTO<T> implements UniversalResponse<T> {
  data: T;

  @ApiResponseProperty({ example: null })
  error: Nullable<LogicalErrorFormat>;
  @ApiResponseProperty({ example: 'OK' })
  status: UniversalResponseStatus;
}
