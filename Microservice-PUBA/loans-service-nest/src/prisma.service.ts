import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables before anything else
dotenv.config();

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public prisma: PrismaClient;

  constructor() {
    const directUrl = process.env.DIRECT_URL;

    if (!directUrl) {
      throw new Error(
        'DIRECT_URL environment variable is required for Prisma connection',
      );
    }

    // Create PostgreSQL connection pool for Supabase
    const pool = new Pool({ connectionString: directUrl });

    // Initialize PrismaPg adapter for Prisma 7 compatibility
    const adapter = new PrismaPg(pool);

    // Create PrismaClient with adapter
    this.prisma = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('[Prisma] Successfully connected to loans database');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Expose common Prisma methods for convenience
  get loan() {
    return this.prisma.loan;
  }

  get fine() {
    return this.prisma.fine;
  }
}
