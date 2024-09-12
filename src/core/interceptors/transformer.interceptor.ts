import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TransformedResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseTransformerInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedResponse<T>> {
    return next.handle().pipe(
      map((response) => ({
        statusCode: context.switchToHttp().getResponse().statusCode ?? 500,
        message:
          response?.message ??
          'Unknown error occurred. Please try again later.',
        data: response?.data ? (response.data as T) : undefined,
      })),
    );
  }
}

export const createResponseTransformerInterceptor = () =>
  new ResponseTransformerInterceptor();
