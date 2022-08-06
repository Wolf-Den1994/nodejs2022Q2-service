import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { checkStart } from 'src/utils/log';

@Injectable()
export class LogsService {
  async createLog(log) {
    const logString = `[NEST] ${new Date()} [Level: ${log.level}] Context: ${
      log.context
    } Message: ${log.message}\n`;
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
