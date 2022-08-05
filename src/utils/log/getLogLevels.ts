import { LogLevel } from '@nestjs/common/services/logger.service';

export const getLogLevels = (isProduction: boolean): LogLevel[] => {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['debug', 'verbose', 'log', 'warn', 'error'];
};
