'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loansService } from '@/services/loans.service';
import { Loan } from '@/types/api';
import { toast } from 'sonner';

export default function BorrowingPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setIsLoading(true);
      const data = await loansService.getAllLoans();
      console.log('Raw loans data:', data);
      console.log('First loan:', data[0]);
      console.log('First loan user:', data[0]?.user);
      console.log('First loan book:', data[0]?.book);
      // Show all active and overdue loans (exclude returned)
      const activeLoans = data.filter(loan => loan.status === 'active' || loan.status === 'overdue');
      setLoans(activeLoans);
    } catch (error: any) {
      console.error('Error loading loans:', error);
      toast.error('Gagal memuat data peminjaman');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDaysLate = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <h1 className="text-2xl font-bold">Daftar Peminjaman Aktif</h1>
        <p className="text-primary-foreground/80 mt-1">
          Semua peminjaman yang sedang berlangsung
        </p>
      </div>

      {/* Active Loans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Memuat data peminjaman...</p>
        </div>
      ) : loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Tidak ada peminjaman aktif</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => {
            const daysLate = calculateDaysLate(loan.due_date);
            return (
              <Card key={loan.id} className="border-destructive/50 bg-destructive/5 relative">
                <CardContent className="p-4 space-y-4">
                  {/* Header with Alert */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">
                          {loan.user?.email || `User ID: ${loan.user_id}` || 'No User Data'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">
                          {loan.book?.title || `Book Item ID: ${loan.book_item_id}` || 'No Book Data'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal Pinjam:</span>
                      <span className="font-medium">{formatDate(loan.loan_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jatuh Tempo:</span>
                      <span className="font-medium">{formatDate(loan.due_date)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {daysLate > 0 ? (
                    <Badge variant="destructive" className="w-fit">
                      Terlambat {daysLate} hari
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="w-fit">
                      Masih Dalam Waktu
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
