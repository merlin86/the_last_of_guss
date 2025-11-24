import { UniversalResponse, UniversalResponseStatus } from '@common/types';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UniversalResponseDTO } from './universal-response.dto';
import { LogicalError } from '@common/exceptions/logical.error';

@Injectable()
export class UniversalResponseInterceptor<T> implements NestInterceptor<T, UniversalResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<UniversalResponse<T>> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data: T) => {
        const response: UniversalResponse<T> = {
          status: UniversalResponseStatus.OK,
          error: null,
          data,
        };

        if (data instanceof UniversalResponseDTO) {
          return data as UniversalResponse<T>;
        }

        return response;
      }),
      catchError((err) => {
        if (err instanceof LogicalError) {
          res.status(err.getStatus());
          return of({
            status: UniversalResponseStatus.ERROR,
            data: null as T,
            error: err.format(),
          });
        }
        return throwError(err);
      }),
    );
  }
}
