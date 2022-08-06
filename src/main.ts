import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import 'dotenv/config';
import { CustomLogger } from './logger/customLogger';
import { HttpExceptionFilter } from './utils/log';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(CustomLogger));

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);

  logger.log(`Server running on port ${PORT}`);

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      `${new Date().toUTCString()} Unhandled Rejection at Promise reason: ${reason} promise: ${promise}`,
    );
  });

  process.on('uncaughtException', (err) => {
    logger.error(
      `${new Date().toUTCString()} Uncaught Exception thrown ${
        err.message
      } stack: ${err.stack}`,
    );
    process.exit(1);
  });

  const result = JSON.parse('A string');
}
bootstrap();
