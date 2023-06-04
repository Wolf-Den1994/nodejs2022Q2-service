import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { ConfigService } from '@nestjs/config';
import { getLogLevels } from '../utils/log';
import { LogsService } from './logger.service';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly logsService: LogsService;

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    configService: ConfigService,
    logsService: LogsService,
  ) {
    const environment = configService.get('NODE_ENV');
    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'production'),
    });

    this.logsService = logsService;
  }

  async log(message: string, context?: string) {
    super.log.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'log',
    });
  }

  async error(message: string, stack?: string, context?: string) {
    super.error.apply(this, [message, stack, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }

  async warn(message: string, context?: string) {
    super.warn.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'warn',
    });
  }

  async debug(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'debug',
    });
  }

  async verbose(message: string, context?: string) {
    super.verbose.apply(this, [message, context]);

    await this.logsService.createLog({
      message,
      context,
      level: 'verbose',
    });
  }
}
