import { LogicalError } from '@common/exceptions/logical.error';
import { HttpStatus } from '@nestjs/common';

export class InvalidPasswordError extends LogicalError {
  constructor() {
    super({ code: 'login_001', message: 'Invalid user name or password' }, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidAuthHeaderError extends LogicalError {
  constructor() {
    super({ code: 'login_002', message: 'Invalid authorization header' }, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidTokenError extends LogicalError {
  constructor() {
    super({ code: 'login_003', message: 'Invalid or expired token' }, HttpStatus.UNAUTHORIZED);
  }
}
