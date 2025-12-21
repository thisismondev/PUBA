'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Buku Dipinjam',
      value: '3',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Total aktif',
    },
    {
      title: 'Belum Dikembalikan',
      value: '2',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Segera kembalikan',
    },
    {
      title: 'Terlambat',
      value: '1',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Ada denda',
    },
    {
      title: 'Riwayat',
      value: '15',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      description: 'Total peminjaman',
    },
  ];

  const recentBorrowings = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      borrowDate: '2025-12-15',
      dueDate: '2025-12-29',
      status: 'active',
      daysLeft: 8,
    },
    {
      id: 2,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      borrowDate: '2025-12-10',
      dueDate: '2025-12-24',
      status: 'active',
      daysLeft: 3,
    },
    {
      id: 3,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      borrowDate: '2025-12-01',
      dueDate: '2025-12-15',
      status: 'late',
      daysLate: 6,
    },
  ];

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
              <Link href="/dashboard/borrowing">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBorrowings.map((book) => (
                <div key={book.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
                  <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1">
                    <div className="h-14 w-10 md:h-16 md:w-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm md:text-base truncate">{book.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{book.author}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Pinjam: {book.borrowDate}</span>
                        <span className="hidden md:inline">•</span>
                        <span>Tempo: {book.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {book.status === 'active' ? (
                      <>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {book.daysLeft} hari lagi
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="destructive">Terlambat {book.daysLate} hari</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors cursor-pointer group">
          <Link href="/dashboard/books">
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
          <Link href="/dashboard/borrowing">
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
