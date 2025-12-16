import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { Loan, LoanStatus } from '@prisma/client';

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);
  private readonly booksServiceUrl: string;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {
    this.booksServiceUrl =
      process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';
    this.logger.log(`Books service URL: ${this.booksServiceUrl}`);
  }

  /**
   * POST /loans - Borrow a book (Saga Pattern with Rollback)
   * 
   * Steps:
   * 1. Validate book item availability via books-service
   * 2. Create loan record in database
   * 3. Update book item status to 'borrowed' via books-service
   * 4. If step 3 fails, rollback by deleting the loan (Compensating Transaction)
   */
  async create(createLoanDto: CreateLoanDto, userId: number, userToken?: string): Promise<Loan> {
    const { book_item_id } = createLoanDto;

    this.logger.log(
      `[Saga Start] User ${userId} attempting to borrow item ${book_item_id}`,
    );

    // STEP 1: Validate availability via books-service
    let bookItem: any;
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.booksServiceUrl}/api/book-items/${book_item_id}`,
        ),
      );
      bookItem = response.data;

      this.logger.log(
        `[Saga Step 1] Book item fetched: ${bookItem.inventory_code}, status: ${bookItem.status}`,
      );

      if (bookItem.status !== 'available') {
        throw new BadRequestException(
          `Buku tidak tersedia. Status saat ini: ${bookItem.status}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        `[Saga Step 1 Failed] Cannot fetch book item: ${error.message}`,
      );

      if (error.response?.status === 404) {
        throw new NotFoundException(
          `Item buku dengan ID ${book_item_id} tidak ditemukan`,
        );
      }

      throw new InternalServerErrorException(
        'Gagal memeriksa ketersediaan buku. Silakan coba lagi.',
      );
    }

    // STEP 2: Create loan record
    let createdLoan: Loan;
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // 7 days from now

      createdLoan = await this.prisma.loan.create({
        data: {
          user_id: userId,
          book_item_id: BigInt(book_item_id),
          due_date: dueDate,
          status: LoanStatus.active,
        },
      });

      this.logger.log(
        `[Saga Step 2] Loan record created: ID ${createdLoan.id}`,
      );
    } catch (error) {
      this.logger.error(
        `[Saga Step 2 Failed] Cannot create loan: ${error.message}`,
      );
      throw new InternalServerErrorException('Gagal membuat peminjaman');
    }

    // STEP 3: Update book item status to 'borrowed' via books-service
    try {
      const token = process.env.SYSTEM_JWT_TOKEN || userToken; // Use system token or forward user token
      
      if (!token) {
        this.logger.error(
          '[Saga Step 3] No authentication token available for inter-service call',
        );
        throw new Error('No token available for books-service authentication');
      }

      await firstValueFrom(
        this.httpService.patch(
          `${this.booksServiceUrl}/api/book-items/${book_item_id}/status`,
          { status: 'borrowed' },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      this.logger.log(
        `[Saga Step 3] Book item status updated to 'borrowed' successfully`,
      );
    } catch (error) {
      // ROLLBACK: Delete the created loan (Compensating Transaction)
      this.logger.error(
        `[Saga Step 3 Failed] Cannot update book status: ${error.message}`,
      );
      this.logger.warn(
        `[Saga Rollback] Deleting loan record ID ${createdLoan.id}`,
      );

      try {
        await this.prisma.loan.delete({
          where: { id: createdLoan.id },
        });
        this.logger.log('[Saga Rollback] Loan deleted successfully');
      } catch (rollbackError) {
        this.logger.error(
          `[Saga Rollback Failed] Critical error: Cannot delete loan ${createdLoan.id}. Manual intervention required!`,
        );
      }

      throw new InternalServerErrorException(
        'Gagal mengupdate status buku. Peminjaman dibatalkan.',
      );
    }

    this.logger.log(`[Saga Complete] Loan ${createdLoan.id} successful`);

    // Return loan with book details
    return this.findOne(Number(createdLoan.id));
  }

  /**
   * POST /loans/:id/return - Return a borrowed book
   * 
   * Steps:
   * 1. Find and validate loan
   * 2. Update loan status to 'returned' and set return_date
   * 3. Update book item status to 'available' via books-service
   * 4. Calculate and create fine if overdue
   */
  async returnBook(loanId: number, userToken?: string): Promise<{
    loan: Loan;
    fine?: { amount: string; created: boolean };
    message: string;
  }> {
    this.logger.log(`[Return] Processing return for loan ${loanId}`);

    // Step 1: Find loan
    const loan = await this.prisma.loan.findUnique({
      where: { id: BigInt(loanId) },
    });

    if (!loan) {
      throw new NotFoundException(`Peminjaman dengan ID ${loanId} tidak ditemukan`);
    }

    if (loan.status === LoanStatus.returned) {
      throw new BadRequestException('Buku sudah dikembalikan sebelumnya');
    }

    // Step 2: Update loan record
    const returnDate = new Date();
    const updatedLoan = await this.prisma.loan.update({
      where: { id: BigInt(loanId) },
      data: {
        status: LoanStatus.returned,
        return_date: returnDate,
      },
    });

    this.logger.log(`[Return Step 1] Loan ${loanId} marked as returned`);

    // Step 3: Update book item status to 'available'
    try {
      const token = process.env.SYSTEM_JWT_TOKEN || userToken;

      if (!token) {
        this.logger.error(
          '[Return Step 2] No authentication token available for inter-service call',
        );
        throw new Error('No token available for books-service authentication');
      }

      await firstValueFrom(
        this.httpService.patch(
          `${this.booksServiceUrl}/api/book-items/${loan.book_item_id}/status`,
          { status: 'available' },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      this.logger.log(
        `[Return Step 2] Book item ${loan.book_item_id} status updated to 'available'`,
      );
    } catch (error) {
      this.logger.error(
        `[Return Step 2 Failed] Cannot update book status: ${error.message}`,
      );
      // Don't rollback the loan return, but log the error
      this.logger.warn(
        `Manual intervention may be required for book item ${loan.book_item_id}`,
      );
    }

    // Step 4: Check if overdue and create fine
    let fineInfo: { amount: string; created: boolean } | undefined;
    const isOverdue = returnDate > loan.due_date;

    if (isOverdue) {
      const daysLate = Math.ceil(
        (returnDate.getTime() - loan.due_date.getTime()) / (1000 * 60 * 60 * 24),
      );
      const fineAmount = daysLate * 5000; // Rp 5,000 per day

      this.logger.log(
        `[Return] Loan is overdue by ${daysLate} days. Fine: Rp ${fineAmount}`,
      );

      // Check if fine already exists
      const existingFine = await this.prisma.fine.findUnique({
        where: { loan_id: updatedLoan.id },
      });

      if (!existingFine) {
        await this.prisma.fine.create({
          data: {
            loan_id: updatedLoan.id,
            amount: fineAmount,
            is_paid: false,
          },
        });

        fineInfo = {
          amount: `Rp ${fineAmount.toLocaleString('id-ID')}`,
          created: true,
        };

        this.logger.log(`[Return] Fine created: ${fineInfo.amount}`);
      } else {
        fineInfo = {
          amount: `Rp ${Number(existingFine.amount).toLocaleString('id-ID')}`,
          created: false,
        };
      }
    }

    return {
      loan: updatedLoan,
      fine: fineInfo,
      message: fineInfo
        ? `Buku berhasil dikembalikan. Denda: ${fineInfo.amount} (${fineInfo.created ? 'baru dibuat' : 'sudah ada'})`
        : 'Buku berhasil dikembalikan tepat waktu',
    };
  }

  /**
   * GET /loans/:id - Get loan detail
   */
  async findOne(id: number): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { id: BigInt(id) },
      include: {
        fine: true,
      },
    });

    if (!loan) {
      throw new NotFoundException(`Peminjaman dengan ID ${id} tidak ditemukan`);
    }

    return loan;
  }

  /**
   * GET /loans/my - Get current user's loan history
   */
  async findUserLoans(userId: number): Promise<Loan[]> {
    return this.prisma.loan.findMany({
      where: { user_id: userId },
      include: {
        fine: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * GET /loans - Get all loans (admin only)
   */
  async findAll(): Promise<Loan[]> {
    return this.prisma.loan.findMany({
      include: {
        fine: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
