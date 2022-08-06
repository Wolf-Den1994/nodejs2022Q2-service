import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { checkStart, getLogLevelsMiddleware } from 'src/utils/log';

@Injectable()
export class LogsService {
  private level: LogLevel[];

  constructor(configService: ConfigService) {
    const levelEnv = configService.get('LOGGER_LEVEL');
    this.level = getLogLevelsMiddleware(levelEnv);
  }

  async createLog(log) {
    if (!this.level.includes(log.level)) return;
    const logString = `[NEST] ${new Date().toUTCString()} [Level: ${
      log.level
    }] Context: ${log.context} Message: ${log.message}\n`;
    const size = +process.env.MAX_LOGGER_FILE;

    try {
      if (checkStart(log.context)) return;
      const files = await fs.readdir('src/logs');
      const currentFile = files[files.length - 1];
      if (!currentFile) {
        await this.createFile(logString, 0, size, `nest_${Date.now()}.log`);
      } else {
        const lastFileStat = await fs.stat(`src/logs/${currentFile}`);
        const lastFileSize = lastFileStat.size;
        await this.createFile(logString, lastFileSize, size, currentFile);
      }
    } catch (error) {
      await fs.mkdir('src/logs');
      await this.createFile(logString, 0, size, `nest_${Date.now()}.log`);
    }
  }

  async createFile(logString, lastFileSize, size, currentFile) {
    if (lastFileSize < size) {
      try {
        await fs.appendFile(`src/logs/${currentFile}`, logString);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await fs.writeFile(`src/logs/nest_${Date.now()}.log`, logString);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
