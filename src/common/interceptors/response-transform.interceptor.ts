import { map, Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ResponseTransformInterceptor
  implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((result) => {

        const statusCode = response.statusCode;
        const success = statusCode >= 200 && statusCode < 300;

        if (
          result !== null &&
          typeof result === 'object' &&
          'data' in result
        ) {
          return {
            success,
            statusCode: response.statusCode,
            message:
              'message' in result &&
                typeof result.message === 'string'
                ? result.message
                : 'Request successful',
            data: result.data,
          };
        }

        return {
          success,
          statusCode: response.statusCode,
          message: 'Request successful',
          data: result,
        };
      }),
    );
  }
}
