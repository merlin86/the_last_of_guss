import { Nullable } from '@common/utils/typeguards';

export type LogicalErrorFormat = {
  code: string;
  message: string;
};

export enum UniversalResponseStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

export type UniversalResponse<T> = {
  data: T;
  status: UniversalResponseStatus;
  error: Nullable<LogicalErrorFormat>;
};
