import { LogicalErrorFormat } from '@common/types';
import { HttpStatus } from '@nestjs/common';

export class LogicalError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(error: LogicalErrorFormat, statusCode: number = HttpStatus.BAD_REQUEST) {
    super(error.message);
    this.code = error.code;
    this.statusCode = statusCode;
  }

  format(): LogicalErrorFormat {
    return {
      code: this.code,
      message: this.message,
    };
  }

  getStatus(): number {
    return this.statusCode;
  }
}
