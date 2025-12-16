import { Module } from '@nestjs/common';
import { BookItemsService } from './book-items.service';
import { BookItemsController } from './book-items.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BookItemsController],
  providers: [BookItemsService, PrismaService],
  exports: [BookItemsService],
})
export class BookItemsModule {}
