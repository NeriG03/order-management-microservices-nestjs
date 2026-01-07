/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | object;
    let error: string;

    // Determinar el tipo de excepción y extraer información
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.constructor.name;
      } else {
        message = (exceptionResponse as any).message || exceptionResponse;
        error = (exceptionResponse as any).error || exception.constructor.name;

        // Manejo especial para errores de validación de class-validator
        if (status === 400 && Array.isArray(message)) {
          error = 'ValidationError';
        }
      }
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as any).code === 'number'
    ) {
      // Manejo de errores gRPC
      const rpcException = exception as any;
      const rpcCode = rpcException.code;
      message = rpcException.details || rpcException.message || 'Error en microservicio';

      switch (rpcCode) {
        case 3: // INVALID_ARGUMENT
          status = HttpStatus.BAD_REQUEST;
          error = 'BadRequestException';
          break;
        case 5: // NOT_FOUND
          status = HttpStatus.NOT_FOUND;
          error = 'NotFoundException';
          break;
        case 7: // PERMISSION_DENIED
          status = HttpStatus.FORBIDDEN;
          error = 'ForbiddenException';
          break;
        case 16: // UNAUTHENTICATED
          status = HttpStatus.UNAUTHORIZED;
          error = 'UnauthorizedException';
          break;
        case 6: // ALREADY_EXISTS
          status = HttpStatus.CONFLICT;
          error = 'ConflictException';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          error = 'InternalServerError';
      }
    } else if (exception instanceof Error) {
      // Error genérico no HTTP
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
      error = 'InternalServerError';

      // Log del error completo para debugging
      this.logger.error(`Error no controlado: ${exception.message}`, exception.stack);
    } else {
      // Error desconocido
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
      error = 'UnknownError';

      this.logger.error('Error desconocido:', exception);
    }

    // Información de la petición para el log (compatible con Fastify)
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers['user-agent'] || 'Unknown';
    const ip = request.ip || request.socket?.remoteAddress || 'Unknown';

    // Log del error - diferente formato para validaciones
    let errorLog: string;
    if (status === 400 && Array.isArray(message)) {
      // Para errores de validación, mostrar todos los mensajes
      errorLog = `${method} ${url} ${status} - ${ip} - "${userAgent}" - VALIDATION ERROR: ${message.join(', ')}`;
    } else {
      // Para otros errores
      errorLog = `${method} ${url} ${status} - ${ip} - "${userAgent}" - ERROR: ${
        exception instanceof Error ? exception.message : 'Unknown error'
      }`;
    }

    if (status >= 500) {
      this.logger.error(errorLog);
    } else {
      this.logger.warn(errorLog);
    }

    // Respuesta estructurada al cliente
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: error,
      message: message,
      // Solo incluir stack trace en desarrollo para errores del servidor
      ...(process.env.NODE_ENV === 'development' &&
        status >= 500 &&
        exception instanceof Error && {
          stack: exception.stack,
        }),
    };

    response.status(status).send(errorResponse);
  }
}
