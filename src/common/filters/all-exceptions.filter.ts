import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ZodValidationException } from 'nestjs-zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse() as
        | string
        | { message?: string | string[] };
      message =
        typeof response === 'object'
          ? ((Array.isArray(response.message)
              ? response.message[0]
              : response.message) ?? exception.message)
          : response;
    }

    if (exception instanceof ZodValidationException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse() as { errors: unknown };
      message = 'Validation failed';
      errors = response.errors;
    }

    const responseBody: Record<string, unknown> = {
      success: false,
      message,
      errors:
        errors ??
        (exception instanceof HttpException
          ? exception.getResponse()
          : exception instanceof Error
            ? exception.message
            : exception),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
