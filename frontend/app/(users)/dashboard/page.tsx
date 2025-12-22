'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { loansService } from '@/services/loans.service';
import { Loan } from '@/types/api';
import { toast } from 'sonner';

export default function DashboardPage() {
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

  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Calculate stats from loans data
  const activeBorrowings = loans.filter(loan => loan.status === 'active' || loan.status === 'overdue');
  const overdueBorrowings = loans.filter(loan => loan.status === 'overdue');
  const completedBorrowings = loans.filter(loan => loan.status === 'returned');
  const nearDueBorrowings = activeBorrowings.filter(loan => {
    const daysLeft = calculateDaysLeft(loan.due_date);
    return daysLeft > 0 && daysLeft <= 3 && loan.status === 'active';
  });

  const stats = [
    {
      title: 'Buku Dipinjam',
      value: activeBorrowings.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Total aktif',
    },
    {
      title: 'Segera Jatuh Tempo',
      value: nearDueBorrowings.length.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: '≤ 3 hari lagi',
    },
    {
      title: 'Terlambat',
      value: overdueBorrowings.length.toString(),
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Perlu dikembalikan',
    },
    {
      title: 'Riwayat',
      value: completedBorrowings.length.toString(),
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      description: 'Selesai',
    },
  ];

  // Recent borrowings (last 3 active)
  const recentBorrowings = activeBorrowings.slice(0, 3);

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Selamat Datang Kembali! 👋</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola peminjaman buku Anda dengan mudah dan efisien</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} ${stat.color} p-2 md:p-3 rounded-lg`}>
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        {/* Recent Borrowings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg md:text-xl">Peminjaman Saya</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/borrowing">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">Memuat data...</p>
              </div>
            ) : recentBorrowings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada peminjaman aktif</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link href="/books">Pinjam Buku</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBorrowings.map((loan) => {
                  const daysLeft = calculateDaysLeft(loan.due_date);
                  const isOverdue = loan.status === 'overdue';
                  const formatDate = (dateString: string) => {
                    const date = new Date(dateString);
                    return date.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
                  };
                  return (
                    <div key={loan.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
                      <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1">
                        {loan.book?.cover_url ? (
                          <img 
                            src={loan.book.cover_url} 
                            alt={loan.book.title}
                            className="h-14 w-10 md:h-16 md:w-12 object-cover rounded flex-shrink-0"
                          />
                        ) : (
                          <div className="h-14 w-10 md:h-16 md:w-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm md:text-base truncate">{loan.book?.title || 'Book'}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">{loan.book?.author || 'Author'}</p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Pinjam: {formatDate(loan.loan_date)}</span>
                            <span className="hidden md:inline">•</span>
                            <span>Tempo: {formatDate(loan.due_date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isOverdue ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Jatuh tempo hari ini'}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Terlambat {Math.abs(daysLeft)} hari</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <Link href="/books">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Katalog Buku</h3>
                  <p className="text-sm text-muted-foreground">Jelajahi koleksi perpustakaan</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <Link href="/borrowing">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-200 transition-colors">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Riwayat Peminjaman</h3>
                  <p className="text-sm text-muted-foreground">Lihat semua peminjaman Anda</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <Link href="/dashboard/profile">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Profil Saya</h3>
                  <p className="text-sm text-muted-foreground">Kelola informasi akun</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
