import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    super({
      datasourceUrl: config.get('DATABASE_URL'),
    });
  }

  async onModuleInit() {
    await this.$connect().then(() =>
      this.logger.log('Prisma client connected'),
    );
  }

  async onModuleDestroy() {
    await this.$disconnect().then(() =>
      this.logger.log('Prisma client disconnected'),
    );
  }
}
