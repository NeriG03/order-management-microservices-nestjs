// product-service/src/common/filters/rpc-exception.filter.ts

import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';

@Catch()
export class GracefulRpcExceptionFilter implements RpcExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let code = 13; // Internal por defecto
    let message = exception.message || 'Internal server error';

    // Si es una excepción de NestJS (HttpException), mapeamos el status
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      message = (exception.getResponse() as any).message || exception.message;

      switch (status) {
        case 404:
          code = 5;
          break; // NOT_FOUND
        case 400:
          code = 3;
          break; // INVALID_ARGUMENT
        case 401:
          code = 16;
          break; // UNAUTHENTICATED
        case 403:
          code = 7;
          break; // PERMISSION_DENIED
      }
    } else if (exception.code) {
      // Si ya tiene un código (posiblemente de gRPC o RpcException)
      code = exception.code;
    }

    return throwError(() => ({
      code: code,
      message: message,
    }));
  }
}
