import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoansModule } from './loans/loans.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [LoansModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
