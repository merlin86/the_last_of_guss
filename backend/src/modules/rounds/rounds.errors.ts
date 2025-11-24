import { LogicalError } from '@common/exceptions/logical.error';
import { HttpStatus } from '@nestjs/common';

export class UnauthorizedToCreateRoundError extends LogicalError {
  constructor() {
    super({ code: 'rounds_001', message: 'This user is not authorized to create a round' }, HttpStatus.FORBIDDEN);
  }
}
