'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, BookOpen, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loansService } from '@/services/loans.service';
import { Loan } from '@/types/api';
import { toast } from 'sonner';

export default function ReturnPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningIds, setReturningIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setIsLoading(true);
      const data = await loansService.getAllLoans();
      // Filter borrowed loans (not returned yet)
      const borrowedLoans = data.filter(loan => loan.status === 'active' || loan.status === 'overdue');
      setLoans(borrowedLoans);
    } catch (error: any) {
      console.error('Error loading loans:', error);
      toast.error('Gagal memuat data peminjaman');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (loanId: string) => {
    setReturningIds(prev => new Set(prev).add(loanId));
    try {
      await loansService.returnBook(loanId);
      toast.success('Buku berhasil dikembalikan');
      loadLoans();
    } catch (error: any) {
      console.error('Error returning book:', error);
      toast.error(error.response?.data?.message || 'Gagal mengembalikan buku');
    } finally {
      setReturningIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(loanId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <h1 className="text-2xl font-bold">Pengembalian Buku</h1>
        <p className="text-primary-foreground/80 mt-1">
          Kelola pengembalian buku yang dipinjam
        </p>
      </div>

      {/* Active Loans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Memuat data peminjaman...</p>
        </div>
      ) : loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Tidak ada peminjaman aktif</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {loans.map((loan) => {
            const overdue = isOverdue(loan.due_date);
            const isReturning = returningIds.has(loan.id);
            return (
              <Card key={loan.id} className="relative">
                <CardContent className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{loan.user?.email || 'User'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{loan.book?.title || 'Book'}</span>
                      </div>
                    </div>
                    {overdue && (
                      <Badge variant="destructive" className="w-fit">
                        Terlambat
                      </Badge>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal Pinjam:</span>
                      <span className="font-medium">{formatDate(loan.loan_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jatuh Tempo:</span>
                      <span className={`font-medium ${overdue ? 'text-destructive' : ''}`}>
                        {formatDate(loan.due_date)}
                      </span>
                    </div>
                  </div>

                  {/* Return Button */}
                  <Button 
                    onClick={() => handleReturn(loan.id)} 
                    className="w-full"
                    disabled={isReturning}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {isReturning ? 'Memproses...' : 'Konfirmasi Pengembalian'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
