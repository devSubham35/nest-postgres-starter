import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

export interface ResponseBodyInterface {
  success: boolean
  statusCode: number;
  message: string | string[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const success = statusCode >= 200 && statusCode < 300;

    let message: string | string[] = "Internal server error";

    if (exception instanceof HttpException) {

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        exceptionResponse !== null
        && "message" in exceptionResponse
        && typeof exceptionResponse === "object"
      ) {
        const exceptionMessage = exceptionResponse.message;

        if (
          typeof exceptionMessage === 'string' ||
          (Array.isArray(exceptionMessage) &&
            exceptionMessage.every(
              (item) => typeof item === 'string',
            ))
        ) {
          message = exceptionMessage;
        }
      }
    } else if (exception instanceof Error && statusCode !== 500) {
      message = exception.message;
    }

    const responseBody: ResponseBodyInterface = {
      success,
      message,
      statusCode,
    };

    return response.status(statusCode).json(responseBody);
  }
}
