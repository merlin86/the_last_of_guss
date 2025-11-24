import { ValidationError } from 'class-validator';

const SEPARATOR = ', ';

export function exceptionFactory(error: ValidationError | ValidationError[]): string {
  if (Array.isArray(error)) {
    return error.map((e) => exceptionFactory(e)).join(SEPARATOR);
  }
  if (error.constraints) {
    return Object.values(error.constraints).join(SEPARATOR);
  }
  if (error.children) {
    return error.children.map((e) => exceptionFactory(e)).join(SEPARATOR);
  }
  return 'Validation error occurred';
}
