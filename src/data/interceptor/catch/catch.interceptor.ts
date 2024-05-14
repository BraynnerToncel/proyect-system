import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import CatchErrorsList from './catch-error.interceptor';
import { ICatchBodyResponse } from '@interface/catch/catch.interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Logger para registrar mensajes
  private readonly logger: Logger = new Logger('GlobalCatch');
  // Constructor para inyectar HttpAdapterHost
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // Método catch() para manejar excepciones
  catch(exception: unknown, host: ArgumentsHost): void {
    // Obtiene el nombre de la excepción
    const exeptionName = exception.constructor.name;
    const { httpAdapter } = this.httpAdapterHost;

    // Accede al contexto HTTP
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Busca si la excepción está en la lista de errores manejados
    const errorCached = CatchErrorsList[exeptionName];
    let responseBody: ICatchBodyResponse = {
      message: (exception as any).message.message,
      code: 'HttpException',
      status: 500,
    };

    // Si la excepción está en la lista de errores manejados, se devuelve la respuesta personalizada
    if (errorCached) {
      responseBody = errorCached(exception);
      this.logger.error(`Error handled ${exception} ${responseBody.message}`);
    }

    // Si la excepción no está en la lista de errores manejados, se devuelve la respuesta genérica
    if (!errorCached) {
      // Obtiene el mensaje de la excepción
      const message: string | undefined = (exception as any).message;
      if (message) responseBody.message = message;
      //Registra el error en el logger
      this.logger.error(
        `Error not handled, description ${
          typeof exception === 'object' ? JSON.stringify(exception) : exception
        }, message ${message}`,
      );
    }

    // Construye la respuesta con la información del error
    responseBody.path = httpAdapter.getRequestUrl(ctx.getRequest());
    responseBody.status =
      exception instanceof HttpException // Si es una HttpException, obtiene el código de estado
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // Si no, código 500

    // Envía la respuesta al cliente
    httpAdapter.reply(response, responseBody, responseBody.status);
  }
}
