import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const message =
          data && typeof data === 'object' && 'message' in data
            ? (data as { message: string }).message
            : 'Operation successful';

        const resultData =
          data && typeof data === 'object' && 'data' in data
            ? (data as { data: T }).data
            : (data as T);

        return {
          success: true,
          message,
          data: resultData,
        };
      }),
    );
  }
}
