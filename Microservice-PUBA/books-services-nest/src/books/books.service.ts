import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id: BigInt(id) },
      include: {
        items: {
          select: {
            id: true,
            inventory_code: true,
            status: true,
            rack_location: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      // Check if ISBN already exists
      if (createBookDto.isbn) {
        const existingBook = await this.prisma.book.findUnique({
          where: { isbn: createBookDto.isbn },
        });

        if (existingBook) {
          throw new ConflictException(
            `Buku dengan ISBN ${createBookDto.isbn} sudah ada`,
          );
        }
      }

      return await this.prisma.book.create({
        data: createBookDto,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Gagal membuat buku baru');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const book = await this.prisma.book.findUnique({
      where: { id: BigInt(id) },
      include: { items: true },
    });

    if (!book) {
      throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);
    }

    // Check if there are borrowed items
    const borrowedItems = book.items.filter((item) => item.status === 'borrowed');
    if (borrowedItems.length > 0) {
      throw new ConflictException(
        `Tidak dapat menghapus buku. Masih ada ${borrowedItems.length} item yang sedang dipinjam`,
      );
    }

    await this.prisma.book.delete({
      where: { id: BigInt(id) },
    });

    return {
      message: `Buku "${book.title}" berhasil dihapus`,
    };
  }

  async getStatistics(): Promise<{
    total_books: number;
    total_items: number;
    available_items: number;
    borrowed_items: number;
  }> {
    const [totalBooks, totalItems, availableItems, borrowedItems] =
      await Promise.all([
        this.prisma.book.count(),
        this.prisma.bookItem.count(),
        this.prisma.bookItem.count({ where: { status: 'available' } }),
        this.prisma.bookItem.count({ where: { status: 'borrowed' } }),
      ]);

    return {
      total_books: totalBooks,
      total_items: totalItems,
      available_items: availableItems,
      borrowed_items: borrowedItems,
    };
  }
}
