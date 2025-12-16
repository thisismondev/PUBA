import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtPayload } from '../guards/jwt-auth.guard';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  /**
   * POST /loans - Borrow a book
   * Access: mahasiswa, admin
   * 
   * This endpoint implements a 3-step saga pattern:
   * 1. Validate availability via books-service
   * 2. Create loan record
   * 3. Update book status to 'borrowed'
   * 
   * If step 3 fails, it will rollback by deleting the loan (compensating transaction)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mahasiswa', 'admin')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createLoanDto: CreateLoanDto,
    @CurrentUser() user: JwtPayload,
    @Req() request: any,
  ) {
    const token = request.headers.authorization?.replace('Bearer ', '');
    return this.loansService.create(createLoanDto, user.user_id, token);
  }

  /**
   * POST /loans/:id/return - Return a borrowed book
   * Access: admin only
   * 
   * This endpoint:
   * 1. Updates loan status to 'returned'
   * 2. Updates book item status to 'available' via books-service
   * 3. Creates fine if returned after due date (Rp 5,000/day)
   */
  @Post(':id/return')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  returnBook(@Param('id', ParseIntPipe) id: number, @Req() request: any) {
    const token = request.headers.authorization?.replace('Bearer ', '');
    return this.loansService.returnBook(id, token);
  }

  /**
   * GET /loans/my - Get current user's loan history
   * Access: authenticated users
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  findUserLoans(@CurrentUser() user: JwtPayload) {
    return this.loansService.findUserLoans(user.user_id);
  }

  /**
   * GET /loans/:id - Get specific loan detail
   * Access: authenticated users
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.findOne(id);
  }

  /**
   * GET /loans - Get all loans
   * Access: admin only
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.loansService.findAll();
  }
}
