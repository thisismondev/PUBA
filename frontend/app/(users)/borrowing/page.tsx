'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { useState } from 'react';

export default function BorrowingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const activeBorrowings = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      borrowDate: '2025-12-15',
      dueDate: '2025-12-29',
      daysLeft: 8,
      status: 'active',
    },
    {
      id: 2,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      borrowDate: '2025-12-10',
      dueDate: '2025-12-24',
      daysLeft: 3,
      status: 'active',
    },
    {
      id: 3,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      borrowDate: '2025-12-01',
      dueDate: '2025-12-15',
      daysLate: 6,
      fine: 30000,
      status: 'late',
    },
  ];

  const completedBorrowings = [
    {
      id: 4,
      title: 'Algoritma & Struktur Data',
      author: 'Dr. Rinaldi Munir',
      borrowDate: '2025-11-10',
      returnDate: '2025-11-24',
      dueDate: '2025-11-24',
      fine: 0,
    },
    {
      id: 5,
      title: 'Basis Data Lanjut',
      author: 'Prof. Bambang',
      borrowDate: '2025-11-01',
      returnDate: '2025-11-18',
      dueDate: '2025-11-15',
      fine: 15000,
    },
  ];

  const filteredActive = activeBorrowings.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredCompleted = completedBorrowings.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Peminjaman Saya</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola dan pantau status peminjaman buku Anda</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari berdasarkan judul atau penulis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Sedang Dipinjam ({activeBorrowings.length})</TabsTrigger>
          <TabsTrigger value="completed">Riwayat ({completedBorrowings.length})</TabsTrigger>
        </TabsList>

        {/* Active Borrowings */}
        <TabsContent value="active" className="space-y-4">
          {filteredActive.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Anda belum meminjam buku'}</p>
              </CardContent>
            </Card>
          ) : (
            filteredActive.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Book Cover */}
                    <div className="h-32 w-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Tanggal Pinjam</p>
                            <p className="font-medium">{book.borrowDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Jatuh Tempo</p>
                            <p className="font-medium">{book.dueDate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex flex-wrap items-center gap-2">
                        {book.status === 'active' ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Clock className="h-3 w-3 mr-1" />
                            {book.daysLeft} hari lagi
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Terlambat {book.daysLate} hari
                            </Badge>
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Denda: Rp {book.fine?.toLocaleString('id-ID')}
                            </Badge>
                          </>
                        )}
                      </div>

                      {/* Action Button */}
                      {book.status === 'late' && (
                        <Button variant="outline" size="sm" className="w-full md:w-auto">
                          Bayar Denda
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Completed Borrowings */}
        <TabsContent value="completed" className="space-y-4">
          {filteredCompleted.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Belum ada riwayat peminjaman'}</p>
              </CardContent>
            </Card>
          ) : (
            filteredCompleted.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Book Cover */}
                    <div className="h-32 w-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Pinjam</p>
                            <p className="font-medium">{book.borrowDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-muted-foreground">Kembali</p>
                            <p className="font-medium text-emerald-600">{book.returnDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-muted-foreground">Denda</p>
                            <p className={`font-medium ${book.fine > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Rp {book.fine.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 w-fit">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Selesai
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
