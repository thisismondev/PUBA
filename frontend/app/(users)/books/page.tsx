'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Search, ChevronDown, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { booksService } from '@/services/books.service';
import { loansService } from '@/services/loans.service';
import { Book } from '@/types/api';
import { toast } from 'sonner';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowingIds, setBorrowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await booksService.getBooks();
      
      // Add availability info to each book
      const booksWithAvailability = await Promise.all(
        data.map(async (book) => {
          try {
            const items = await booksService.getBookItemsByBook(book.id);
            return {
              ...book,
              totalCopies: items.length,
              availableCopies: items.filter(item => item.status === 'available').length,
            };
          } catch {
            return {
              ...book,
              totalCopies: 0,
              availableCopies: 0,
            };
          }
        })
      );
      
      setBooks(booksWithAvailability);
    } catch (error: any) {
      console.error('Error loading books:', error);
      toast.error('Gagal memuat data buku');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async (bookId: string) => {
    setBorrowingIds(prev => new Set(prev).add(bookId));
    try {
      // Get available book items for this book
      const bookItems = await booksService.getBookItemsByBook(bookId);
      const availableItem = bookItems.find(item => item.status === 'available');
      
      if (!availableItem) {
        toast.error('Tidak ada eksemplar yang tersedia');
        return;
      }

      // Convert string ID to number
      await loansService.createLoan({ book_item_id: parseInt(availableItem.id) });
      toast.success('Buku berhasil dipinjam!');
      loadBooks(); // Refresh untuk update availability
    } catch (error: any) {
      console.error('Error borrowing book:', error);
      toast.error(error.response?.data?.message || 'Gagal meminjam buku');
    } finally {
      setBorrowingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || book.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Teknologi', 'Fiksi', 'Non-Fiksi', 'Matematika'];

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Katalog Buku</h1>
        <p className="text-sm md:text-base text-muted-foreground">Jelajahi koleksi perpustakaan dan pinjam buku favorit Anda</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari berdasarkan judul atau penulis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[150px] justify-between">
                  {categoryFilter === 'all' ? 'Semua Kategori' : categoryFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Memuat data buku...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada buku yang ditemukan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Book Cover */}
              <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center overflow-hidden">
                {book.cover_url ? (
                  <img 
                    src={book.cover_url} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <BookOpen className={`h-20 w-20 text-white/80 ${book.cover_url ? 'hidden' : ''}`} />
                {(book.availableCopies || 0) === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">
                      Tidak Tersedia
                    </Badge>
                  </div>
                )}
              </div>

              {/* Book Info */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{book.category || 'Umum'}</Badge>
                  <span className="text-sm text-muted-foreground">{book.publication_year || '-'}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ketersediaan:</span>
                    <span className={`font-medium ${(book.availableCopies || 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {book.availableCopies || 0} / {book.totalCopies || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Penerbit:</span>
                    <span className="font-medium text-xs">{book.publisher || '-'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    disabled={(book.availableCopies || 0) === 0 || borrowingIds.has(book.id)}
                    onClick={() => handleBorrow(book.id)}
                  >
                    {borrowingIds.has(book.id) 
                      ? 'Memproses...' 
                      : (book.availableCopies || 0) > 0 
                      ? 'Pinjam' 
                      : 'Tidak Tersedia'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Menampilkan {filteredBooks.length} dari {books.length} buku
      </div>
    </div>
  );
}
