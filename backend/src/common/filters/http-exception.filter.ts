import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorCode = this.getErrorCode(status);

    response.status(status).json({
      code: errorCode,
      message,
      data: null,
      timestamp: Date.now(),
      path: request.url,
    });
  }

  private getErrorCode(status: number): number {
    const codeMap = {
      400: 40001,
      401: 40100,
      403: 40300,
      404: 40400,
      500: 50000,
    };
    return codeMap[status] || 50000;
  }
}
