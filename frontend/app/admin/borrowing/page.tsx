'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, AlertCircle } from 'lucide-react';

export default function BorrowingPage() {
  const activeLoans = [
    {
      id: 1,
      borrower: 'Ahmad Fauzi',
      book: 'Clean Code',
      borrowDate: '2025-11-25',
      dueDate: '2025-12-09',
      daysLate: 9,
    },
    {
      id: 2,
      borrower: 'Ahmad Fauzi',
      book: 'Sapiens',
      borrowDate: '2025-11-28',
      dueDate: '2025-12-12',
      daysLate: 6,
    },
    {
      id: 3,
      borrower: 'Siti Nurhaliza',
      book: 'The Great Gatsby',
      borrowDate: '2025-11-20',
      dueDate: '2025-12-04',
      daysLate: 14,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <h1 className="text-2xl font-bold">Daftar Peminjaman Aktif</h1>
      </div>

      {/* Active Loans Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeLoans.map((loan) => (
          <Card key={loan.id} className="border-destructive/50 bg-destructive/5 relative">
            <CardContent className="p-4 space-y-4">
              {/* Header with Alert */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{loan.borrower}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{loan.book}</span>
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
                  <span className="font-medium">{loan.borrowDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jatuh Tempo:</span>
                  <span className="font-medium">{loan.dueDate}</span>
                </div>
              </div>

              {/* Late Badge */}
              <Badge variant="destructive" className="w-fit">
                Terlambat {loan.daysLate} hari
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
