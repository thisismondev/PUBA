import apiClient from '@/lib/api-client';
import { Book, CreateBookRequest, UpdateBookRequest, BookStats, BookItem } from '@/types/api';

export const booksService = {
  async getBooks(): Promise<Book[]> {
    const response = await apiClient.get<Book[]>('/books/api/books');
    return response.data;
  },

  async getBook(id: string): Promise<Book> {
    const response = await apiClient.get<Book>(`/books/api/books/${id}`);
    return response.data;
  },

  async getStats(): Promise<BookStats> {
    const response = await apiClient.get<BookStats>('/books/api/books/stats');
    return response.data;
  },

  async createBook(data: CreateBookRequest): Promise<Book> {
    const response = await apiClient.post<Book>('/books/api/books', data);
    return response.data;
  },

  async updateBook(id: string, data: UpdateBookRequest): Promise<Book> {
    const response = await apiClient.patch<Book>(`/books/api/books/${id}`, data);
    return response.data;
  },

  async deleteBook(id: string): Promise<void> {
    await apiClient.delete(`/books/api/books/${id}`);
  },

  // Book Items
  async getAllBookItems(): Promise<BookItem[]> {
    // Get all books and their items
    const books = await this.getBooks();
    const allItems: BookItem[] = [];
    
    for (const book of books) {
      const items = await this.getBookItemsByBook(book.id);
      // Add book info to each item
      const itemsWithBook = items.map(item => ({
        ...item,
        book: { id: book.id, title: book.title, author: book.author }
      }));
      allItems.push(...itemsWithBook);
    }
    
    return allItems;
  },

  async getBookItem(id: string): Promise<BookItem> {
    const response = await apiClient.get<BookItem>(`/books/api/book-items/${id}`);
    return response.data;
  },

  async getBookItemsByBook(bookId: string): Promise<BookItem[]> {
    const response = await apiClient.get<BookItem[]>(`/books/api/book-items/by-book/${bookId}`);
    return response.data;
  },

  async createBookItem(data: { book_id: number; inventory_code: string; status?: string; rack_location?: string }): Promise<BookItem> {
    const response = await apiClient.post<BookItem>('/books/api/book-items', data);
    return response.data;
  },

  async updateBookItemStatus(id: string, status: string): Promise<BookItem> {
    const response = await apiClient.patch<BookItem>(`/books/api/book-items/${id}/status`, { status });
    return response.data;
  },

  async checkAvailability(id: string): Promise<{ available: boolean; bookItem?: BookItem }> {
    const response = await apiClient.get<{ available: boolean; bookItem?: BookItem }>(
      `/books/api/book-items/${id}/availability`
    );
    return response.data;
  },
};
