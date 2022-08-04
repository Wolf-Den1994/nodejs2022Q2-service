import { Injectable } from '@nestjs/common';
import * as fsp from 'node:fs/promises';
import * as fs from 'node:fs';
import { checkStart } from 'src/utils/log';

@Injectable()
export class LogsService {
  async createLog(log) {
    const logString = `[NEST] Level: ${log.level} Context: ${log.context} Message: ${log.message}\n`;
    const size = +process.env.MAX_LOGGER_FILE;

    try {
      if (checkStart(log.context)) return;
      const files = await fsp.readdir('src/logs');
      const currentFile = files[files.length - 1];
      if (!currentFile) {
        this.createFile(logString, 0, size, `nest_${Date.now()}.log`);
      } else {
        const lastFileSize = fs.statSync(`src/logs/${currentFile}`).size;
        this.createFile(logString, lastFileSize, size, currentFile);
      }
    } catch (error) {
      await fsp.mkdir('src/logs');
      this.createFile(logString, 0, size, `nest_${Date.now()}.log`);
    }
  }

  async createFile(logString, lastFileSize, size, currentFile) {
    if (lastFileSize < size) {
      try {
        fsp.appendFile(`src/logs/${currentFile}`, logString);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        fsp.writeFile(`src/logs/nest_${Date.now()}.log`, logString);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
