'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Search, ChevronDown, Star } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const books = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Teknologi',
      year: 2008,
      available: 3,
      total: 5,
      rating: 4.8,
      description: 'Panduan menulis kode yang bersih dan maintainable',
    },
    {
      id: 2,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiksi',
      year: 1925,
      available: 2,
      total: 3,
      rating: 4.5,
      description: 'Novel klasik tentang American Dream',
    },
    {
      id: 3,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      category: 'Non-Fiksi',
      year: 2011,
      available: 1,
      total: 4,
      rating: 4.7,
      description: 'Sejarah singkat umat manusia',
    },
    {
      id: 4,
      title: 'Algoritma & Struktur Data',
      author: 'Dr. Rinaldi Munir',
      category: 'Teknologi',
      year: 2020,
      available: 4,
      total: 6,
      rating: 4.6,
      description: 'Dasar-dasar algoritma dan struktur data',
    },
    {
      id: 5,
      title: 'Basis Data Lanjut',
      author: 'Prof. Bambang',
      category: 'Teknologi',
      year: 2019,
      available: 2,
      total: 5,
      rating: 4.4,
      description: 'Konsep lanjutan dalam database management',
    },
    {
      id: 6,
      title: 'Matematika Diskrit',
      author: 'Dr. Ahmad',
      category: 'Matematika',
      year: 2018,
      available: 3,
      total: 4,
      rating: 4.3,
      description: 'Matematika untuk ilmu komputer',
    },
  ];

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
      {filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada buku yang ditemukan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Book Cover */}
              <div className="relative h-48 bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <BookOpen className="h-20 w-20 text-white/80" />
                {book.available === 0 && (
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
                  <Badge variant="secondary">{book.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{book.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ketersediaan:</span>
                    <span className={`font-medium ${book.available > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {book.available}/{book.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tahun:</span>
                    <span className="font-medium">{book.year}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" disabled={book.available === 0}>
                    {book.available > 0 ? 'Pinjam' : 'Tidak Tersedia'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <BookOpen className="h-4 w-4" />
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
