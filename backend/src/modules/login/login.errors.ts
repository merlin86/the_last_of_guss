import { LogicalError } from '@common/exceptions/logical.error';
import { HttpStatus } from '@nestjs/common';

export class InvalidPasswordError extends LogicalError {
  constructor() {
    super({ code: 'login_001', message: 'Invalid user name or password' }, HttpStatus.UNAUTHORIZED);
  }
}
