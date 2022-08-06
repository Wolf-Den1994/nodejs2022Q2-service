import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { Request, Response, NextFunction } from 'express';
import { getLogLevelsMiddleware } from './getLogLevelsMiddleware';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private level: LogLevel[];

  constructor(configService: ConfigService) {
    const levelEnv = configService.get('LOGGER_LEVEL');
    this.level = getLogLevelsMiddleware(levelEnv);
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { body, query, ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const contentLength = response.get('content-length');

      const message = `Method: ${method} URL: ${originalUrl} query: ${JSON.stringify(
        query,
      )} Body: ${JSON.stringify(
        body,
      )} StatusCode: ${statusCode} StatusMessage: ${statusMessage} ContentLength: ${contentLength} - ${userAgent} ${ip}`;

      if (this.level.includes('error') && statusCode >= 500) {
        return this.logger.error(message);
      }

      if (
        this.level.includes('warn') &&
        statusCode >= 400 &&
        statusCode < 500
      ) {
        return this.logger.warn(message);
      }

      if (this.level.includes('log') && statusCode < 400) {
        return this.logger.log(message);
      }

      if (this.level.includes('verbose') && statusCode < 400) {
        return this.logger.log(message);
      }

      if (this.level.includes('debug') && statusCode < 400) {
        return this.logger.log(message);
      }
    });

    next();
  }
}
