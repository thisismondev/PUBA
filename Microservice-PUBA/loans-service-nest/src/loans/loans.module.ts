import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LoansController],
  providers: [LoansService, PrismaService],
})
export class LoansModule {}
