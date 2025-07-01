import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : message && typeof message === 'object' && 'message' in message
            ? String(message.message)
            : 'Internal server error',
      error:
        message && typeof message === 'object' && 'error' in message
          ? String(message.error)
          : undefined,
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(errorResponse)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }
}
