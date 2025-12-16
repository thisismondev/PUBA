import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookItemsService } from './book-items.service';
import { CreateBookItemDto } from './dto/create-book-item.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtPayload } from '../guards/jwt-auth.guard';

@Controller('book-items')
export class BookItemsController {
  constructor(private readonly bookItemsService: BookItemsService) {}

  /**
   * GET /book-items/:id
   * Public access - Get item detail
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookItemsService.findOne(id);
  }

  /**
   * GET /book-items/:id/availability
   * Public/System access - Check if item is available
   * Used by loans-service before creating loan
   */
  @Get(':id/availability')
  checkAvailability(@Param('id', ParseIntPipe) id: number) {
    return this.bookItemsService.checkAvailability(id);
  }

  /**
   * GET /book-items/by-book/:bookId
   * Public access - Get all items for a specific book
   */
  @Get('by-book/:bookId')
  findByBookId(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookItemsService.findByBookId(bookId);
  }

  /**
   * POST /book-items
   * Admin only - Add physical copy
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createBookItemDto: CreateBookItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bookItemsService.create(createBookItemDto);
  }

  /**
   * PATCH /book-items/:id/status
   * 
   * CRITICAL ENDPOINT FOR INTER-SERVICE COMMUNICATION
   * 
   * Purpose: Update item status when borrowed/returned
   * Called by: loans-service during borrow/return transactions
   * Access: Admin OR valid JWT (system-to-system)
   * 
   * This endpoint MUST be robust because:
   * - loans-service depends on it for transaction completion
   * - Status updates must be atomic and consistent
   * - Failed updates will break the loan workflow
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // Log for debugging inter-service calls
    console.log(
      `[BookItems] Status update requested by user_id: ${user.user_id}, role: ${user.role}`,
    );

    return this.bookItemsService.updateStatus(id, updateStatusDto);
  }
}
