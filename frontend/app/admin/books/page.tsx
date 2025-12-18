'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, Pencil, Trash2, MoreVertical, ChevronDown, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const books = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Teknologi',
      year: 2008,
      available: 3,
      total: 5,
    },
    {
      id: 2,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiksi',
      year: 1925,
      available: 2,
      total: 3,
    },
    {
      id: 3,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      category: 'Non-Fiksi',
      year: 2011,
      available: 1,
      total: 4,
    },
    {
      id: 4,
      title: 'Algoritma & Struktur Data',
      author: 'Dr. Rinaldi Munir',
      category: 'Teknologi',
      year: 2020,
      available: 4,
      total: 6,
    },
    {
      id: 5,
      title: 'Basis Data Lanjut',
      author: 'Prof. Bambang',
      category: 'Teknologi',
      year: 2019,
      available: 2,
      total: 5,
    },
    {
      id: 6,
      title: 'Matematika Diskrit',
      author: 'Dr. Ahmad',
      category: 'Matematika',
      year: 2018,
      available: 3,
      total: 4,
    },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = statusFilter === 'all' || book.category.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">Kelola koleksi berdasarkan judul atau penulis</p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari buku berdasarkan judul atau penulis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[150px] justify-between">
                    {statusFilter === 'all'
                      ? 'Semua Kategori'
                      : statusFilter === 'teknologi'
                      ? 'Teknologi'
                      : statusFilter === 'bahasa'
                      ? 'Bahasa'
                      : statusFilter === 'matematika'
                      ? 'Matematika'
                      : statusFilter === 'fiksi'
                      ? 'Fiksi'
                      : 'Non-Fiksi'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>Semua Kategori</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('teknologi')}>Teknologi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('fiksi')}>Fiksi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('non-fiksi')}>Non-Fiksi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('matematika')}>Matematika</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Buku
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            {/* Book Cover */}
            <div className="relative h-48 bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-white/80" />
            </div>

            {/* Book Info */}
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{book.category}</Badge>
                <span className="text-sm text-muted-foreground">{book.year}</span>
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ketersediaan:</p>
                <div className="flex items-center gap-2">
                  <Progress value={(book.available / book.total) * 100} className="flex-1" />
                  <span className="text-sm font-medium">
                    {book.available}/{book.total}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-3 w-3" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
