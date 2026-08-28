import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Une erreur interne est survenue.";
    let errorCode = "INTERNAL_SERVER_ERROR";
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const obj = res as Record<string, unknown>;
        message = (obj.message as string) || message;
        errorCode = (obj.error as string) || `HTTP_${status}`;
        details = obj.details ?? (Array.isArray(obj.message) ? obj.message : undefined);
      }
    } else {
      this.logger.error(
        `Erreur non interceptée sur [${request.method}] ${request.url} :`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
