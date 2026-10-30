import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { setDefaultAutoSelectFamily } from 'node:net';
import { PrismaClient } from 'src/generated/prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {

    setDefaultAutoSelectFamily(false);

    const databaseUrl = new URL(
      configService.getOrThrow<string>('DATABASE_URL'),
    );

    // Neon rejects insecure PostgreSQL connections.
    // if (!databaseUrl.searchParams.has('sslmode')) {
    //   databaseUrl.searchParams.set('sslmode', 'verify-full');
    // }

    const adapter = new PrismaPg({
      connectionString: databaseUrl.toString(),
      connectionTimeoutMillis: 10_000,
    });

    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
