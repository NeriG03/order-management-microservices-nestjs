/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = Date.now();

    // Información de la petición (compatible con Fastify)
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers['user-agent'] || 'Unknown';
    const ip = request.ip || request.connection?.remoteAddress || 'Unknown';

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const statusCode = response.statusCode;

        // Solo loguear peticiones exitosas (los errores los maneja el GlobalExceptionFilter)
        if (statusCode < 400) {
          const logMessage = `${method} ${url} ${statusCode} - ${duration}ms - ${ip} - "${userAgent}"`;
          this.logger.log(logMessage);
        }
      }),
    );
  }
}
