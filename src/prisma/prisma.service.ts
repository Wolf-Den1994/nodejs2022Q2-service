import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:12345@postgres:5432/postgresdb?schema=public&connect_timeout=300',
        },
      },
    });
  }
}
