import { Nullable } from '@common/utils/typeguards';
import { Request } from 'express';

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

export interface ContextData {
  name: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  context?: ContextData;
}
