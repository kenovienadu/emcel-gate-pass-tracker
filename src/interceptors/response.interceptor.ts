import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Express from 'express';

export interface Response<T> {
  data: T;
}

@Injectable()
export class FormattedResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: Express.Response = context.switchToHttp().getResponse();

        if (data.message && data.statusCode) {
          return data;
        }

        return {
          message: 'Process successful',
          statusCode: response.statusCode,
          data,
        };
      }),
    );
  }
}
