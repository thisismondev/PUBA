'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loansService } from '@/services/loans.service';
import { Loan } from '@/types/api';
import { toast } from 'sonner';

export default function BorrowingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setIsLoading(true);
      const data = await loansService.getMyLoans();
      setLoans(data);
    } catch (error: any) {
      console.error('Error loading loans:', error);
      toast.error('Gagal memuat data peminjaman');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const activeBorrowings = loans.filter(loan => loan.status === 'active' || loan.status === 'overdue');
  const completedBorrowings = loans.filter(loan => loan.status === 'returned');

  const filteredActive = activeBorrowings.filter((loan) => 
    loan.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loan.book?.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompleted = completedBorrowings.filter((loan) => 
    loan.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loan.book?.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Peminjaman Saya</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola dan pantau status peminjaman buku Anda</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          ) : filteredActive.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Anda belum meminjam buku'}</p>
              </CardContent>
            </Card>
          ) : (
            filteredActive.map((loan) => {
              const daysLeft = calculateDaysLeft(loan.due_date);
              const isOverdue = loan.status === 'overdue';
              return (
                <Card key={loan.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Book Cover */}
                      <div className="h-32 w-24 rounded-lg overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                        {loan.book?.cover_url ? (
                          <img 
                            src={loan.book.cover_url} 
                            alt={loan.book.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="h-full w-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center"><svg class="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg></div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">{loan.book?.title || 'Book'}</h3>
                          <p className="text-sm text-muted-foreground">{loan.book?.author || 'Author'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Tanggal Pinjam</p>
                              <p className="font-medium">{formatDate(loan.loan_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Jatuh Tempo</p>
                              <p className="font-medium">{formatDate(loan.due_date)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          {!isOverdue ? (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <Clock className="h-3 w-3 mr-1" />
                              {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Jatuh tempo hari ini'}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Terlambat {Math.abs(daysLeft)} hari
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Completed Borrowings */}
        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          ) : filteredCompleted.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Belum ada riwayat peminjaman'}</p>
              </CardContent>
            </Card>
          ) : (
            filteredCompleted.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Book Cover */}
                    <div className="h-32 w-24 rounded-lg overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                      {loan.book?.cover_url ? (
                        <img 
                          src={loan.book.cover_url} 
                          alt={loan.book.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="h-full w-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center"><svg class="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{loan.book?.title || 'Book'}</h3>
                        <p className="text-sm text-muted-foreground">{loan.book?.author || 'Author'}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Pinjam</p>
                            <p className="font-medium">{formatDate(loan.loan_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-muted-foreground">Kembali</p>
                            <p className="font-medium text-emerald-600">
                              {loan.return_date ? formatDate(loan.return_date) : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-medium text-emerald-600">Selesai</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 w-fit">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Dikembalikan
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
