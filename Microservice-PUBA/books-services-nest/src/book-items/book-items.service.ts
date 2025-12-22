import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookItemDto } from './dto/create-book-item.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { BookItem, ItemStatus } from '@prisma/client';

@Injectable()
export class BookItemsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get a single book item by ID
   */
  async findOne(id: number): Promise<BookItem> {
    const item = await this.prisma.bookItem.findUnique({
      where: { id: BigInt(id) },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            cover_url: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(
        `Item buku dengan ID ${id} tidak ditemukan`,
      );
    }

    return item;
  }

  /**
   * Create a new physical book item
   * Admin only
   */
  async create(createBookItemDto: CreateBookItemDto): Promise<BookItem> {
    // Verify book exists
    const book = await this.prisma.book.findUnique({
      where: { id: BigInt(createBookItemDto.book_id) },
    });

    if (!book) {
      throw new NotFoundException(
        `Buku dengan ID ${createBookItemDto.book_id} tidak ditemukan`,
      );
    }

    // Check if inventory code already exists
    const existingItem = await this.prisma.bookItem.findUnique({
      where: { inventory_code: createBookItemDto.inventory_code },
    });

    if (existingItem) {
      throw new ConflictException(
        `Kode inventaris ${createBookItemDto.inventory_code} sudah digunakan`,
      );
    }

    try {
      return await this.prisma.bookItem.create({
        data: {
          book_id: BigInt(createBookItemDto.book_id),
          inventory_code: createBookItemDto.inventory_code,
          status: createBookItemDto.status || ItemStatus.available,
          rack_location: createBookItemDto.rack_location,
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              cover_url: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Gagal menambahkan item buku');
    }
  }

  /**
   * CRITICAL ENDPOINT: Update item status
   * Used by loans-service for borrowing/returning books
   * This must be robust and transactional
   */
  async updateStatus(
    id: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<BookItem> {
    // Verify item exists
    const item = await this.prisma.bookItem.findUnique({
      where: { id: BigInt(id) },
    });

    if (!item) {
      throw new NotFoundException(
        `Item buku dengan ID ${id} tidak ditemukan`,
      );
    }

    // Business logic validation
    const currentStatus = item.status;
    const newStatus = updateStatusDto.status;

    // Validate status transitions
    if (currentStatus === ItemStatus.borrowed && newStatus === ItemStatus.borrowed) {
      throw new ConflictException(
        'Item sudah dalam status borrowed. Tidak dapat dipinjam lagi',
      );
    }

    if (currentStatus === ItemStatus.lost || currentStatus === ItemStatus.repair) {
      if (newStatus === ItemStatus.borrowed) {
        throw new ConflictException(
          `Item dalam status ${currentStatus}. Tidak dapat dipinjam`,
        );
      }
    }

    // Perform update
    try {
      const updatedItem = await this.prisma.bookItem.update({
        where: { id: BigInt(id) },
        data: {
          status: newStatus,
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              cover_url: true,
            },
          },
        },
      });

      return updatedItem;
    } catch (error) {
      throw new BadRequestException(
        `Gagal mengupdate status item: ${error.message}`,
      );
    }
  }

  /**
   * Check if item is available for borrowing
   * Can be called by loans-service before creating loan
   */
  async checkAvailability(id: number): Promise<{
    available: boolean;
    status: ItemStatus;
    message: string;
  }> {
    const item = await this.findOne(id);

    const available = item.status === ItemStatus.available;

    return {
      available,
      status: item.status,
      message: available
        ? 'Item tersedia untuk dipinjam'
        : `Item tidak tersedia. Status: ${item.status}`,
    };
  }

  /**
   * Get all items for a specific book
   */
  async findByBookId(bookId: number): Promise<BookItem[]> {
    return this.prisma.bookItem.findMany({
      where: { book_id: BigInt(bookId) },
      orderBy: { created_at: 'desc' },
    });
  }
}
