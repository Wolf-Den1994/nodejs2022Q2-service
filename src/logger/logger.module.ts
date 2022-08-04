import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogsService } from './logger.service';
import { CustomLogger } from './customLogger';

@Module({
  imports: [ConfigModule],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}
