/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    // Para gRPC, usamos switchToRpc() en lugar de switchToHttp()
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    const metadata = rpcContext.getContext();

    // Obtener información del controlador y método
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const rpcMethod = `${controller}.${handler}`;

    // Serializar los datos de entrada de forma segura
    const requestData = this.sanitizeData(data);

    this.logger.log(`[gRPC Request] ${rpcMethod} - Data: ${JSON.stringify(requestData)}`);

    return next.handle().pipe(
      tap(response => {
        const duration = Date.now() - start;
        const responseData = this.sanitizeData(response);

        /* this.logger.log(
          `[gRPC Response] ${rpcMethod} - Duration: ${duration}ms - Response: ${JSON.stringify(responseData)}`,
        ); */
      }),
      catchError(error => {
        const duration = Date.now() - start;

        this.logger.error(
          `[gRPC Error] ${rpcMethod} - Duration: ${duration}ms - Error: ${error.message}`,
          error.stack,
        );

        throw error;
      }),
    );
  }

  private sanitizeData(data: any): any {
    if (!data) return {};

    // Limitar la profundidad y tamaño de los datos para evitar logs muy grandes
    try {
      const stringified = JSON.stringify(data);
      if (stringified.length > 500) {
        return JSON.stringify(data).substring(0, 500) + '...';
      }
      return data;
    } catch {
      return '[Non-serializable data]';
    }
  }
}
