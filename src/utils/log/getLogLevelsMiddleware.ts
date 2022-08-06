import { LogLevel } from '@nestjs/common/services/logger.service';

const levels = {
  '1': 'debug',
  '2': 'verbose',
  '3': 'log',
  '4': 'warn',
  '5': 'error',
};

export const getLogLevelsMiddleware = (level: string): LogLevel[] => {
  switch (levels[level]) {
    case 'debug':
      return ['debug'];
    case 'verbose':
      return ['debug', 'verbose'];
    case 'log':
      return ['debug', 'verbose', 'log'];
    case 'warn':
      return ['debug', 'verbose', 'log', 'warn'];
    case 'error':
      return ['debug', 'verbose', 'log', 'warn', 'error'];
  }
};
