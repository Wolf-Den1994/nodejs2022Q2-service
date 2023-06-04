import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { EOL } from 'os';
import {
  checkStart,
  getLogLevelsMiddleware,
  getLogSeparate,
} from 'src/utils/log';

@Injectable()
export class LogsService {
  private level: LogLevel[];
  private separate: boolean;

  constructor(configService: ConfigService) {
    const levelEnv = configService.get('LOGGER_LEVEL');
    const separateEnv = configService.get('LOGGER_SEPARATE');

    this.level = getLogLevelsMiddleware(levelEnv);
    this.separate = getLogSeparate(separateEnv);
  }

  async createLog(log) {
    if (!this.level.includes(log.level)) return;
    const logString = `[NEST] ${new Date().toUTCString()} [Level: ${
      log.level
    }] Context: ${log.context} Message: ${log.message}${EOL}`;
    const size = +process.env.MAX_LOGGER_FILE;

    try {
      if (checkStart(log.context)) return;

      if (this.separate && log.level === 'error') {
        const files = await fs.readdir('src/logs/errors');
        const currentFile = files[files.length - 1];

        if (!currentFile) {
          await this.createFile(
            logString,
            0,
            size,
            `error_${Date.now()}.log`,
            'src/logs/errors',
          );
        } else {
          const lastFileStat = await fs.stat(`src/logs/errors/${currentFile}`);
          const lastFileSize = lastFileStat.size;
          await this.createFile(
            logString,
            lastFileSize,
            size,
            currentFile,
            'src/logs/errors',
          );
        }
      }

      const files = await fs.readdir('src/logs');
      const currentFile = files[files.length - 1];
      if (!currentFile) {
        await this.createFile(
          logString,
          0,
          size,
          `log_${Date.now()}.log`,
          'src/logs',
        );
      } else {
        const lastFileStat = await fs.stat(`src/logs/${currentFile}`);
        const lastFileSize = lastFileStat.size;
        await this.createFile(
          logString,
          lastFileSize,
          size,
          currentFile,
          'src/logs',
        );
      }
    } catch (error) {
      await fs.mkdir('src/logs');
      await fs.mkdir('src/logs/errors');
      await this.createFile(
        logString,
        0,
        size,
        `log_${Date.now()}.log`,
        'src/logs',
      );
      await this.createFile(
        `Created errors file ${EOL}`,
        0,
        size,
        `error_${Date.now()}.log`,
        'src/logs/errors',
      );
    }
  }

  async createFile(logString, lastFileSize, size, currentFile, path) {
    if (lastFileSize >= size - 1024) {
      try {
        await fs.writeFile(`${path}/log_${Date.now()}.log`, logString);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await fs.appendFile(`${path}/${currentFile}`, logString);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
