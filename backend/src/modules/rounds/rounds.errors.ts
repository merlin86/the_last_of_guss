import { LogicalError } from '@common/exceptions/logical.error';
import { HttpStatus } from '@nestjs/common';

export class UnauthorizedToCreateRoundError extends LogicalError {
  constructor() {
    super({ code: 'rounds_001', message: 'This user is not authorized to create a round' }, HttpStatus.FORBIDDEN);
  }
}

export class RoundNotFoundError extends LogicalError {
  constructor(round_id: string) {
    super(
      { code: 'rounds_002', message: `The specified round with ID ${round_id} was not found` },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserNotFoundError extends LogicalError {
  constructor(name: string) {
    super({ code: 'rounds_003', message: `User ${name} was not found` }, HttpStatus.NOT_FOUND);
  }
}

export class RoundNotStartedError extends LogicalError {
  constructor() {
    super({ code: 'rounds_004', message: 'The round has not started yet' }, HttpStatus.BAD_REQUEST);
  }
}

export class RoundFinishedError extends LogicalError {
  constructor() {
    super({ code: 'rounds_005', message: 'The round has already finished' }, HttpStatus.BAD_REQUEST);
  }
}
