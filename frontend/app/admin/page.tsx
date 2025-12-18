'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, TrendingUp, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Page() {
  const stats = [
    {
      title: 'Total Buku',
      value: '22',
      icon: BookOpen,
    },
    {
      title: 'Buku Dipinjam',
      value: '8',
      icon: Clock,
    },
    {
      title: 'Anggota Aktif',
      value: '3',
      icon: Users,
    },
    {
      title: 'Keterlambatan',
      value: '3',
      icon: TrendingUp,
    },
  ];

  // Data statistik peminjaman per bulan
  const borrowingData = [
    { month: 'Jan', peminjaman: 45, pengembalian: 42, terlambat: 3 },
    { month: 'Feb', peminjaman: 52, pengembalian: 48, terlambat: 4 },
    { month: 'Mar', peminjaman: 38, pengembalian: 35, terlambat: 2 },
    { month: 'Apr', peminjaman: 61, pengembalian: 58, terlambat: 5 },
    { month: 'Mei', peminjaman: 48, pengembalian: 46, terlambat: 2 },
    { month: 'Jun', peminjaman: 55, pengembalian: 52, terlambat: 4 },
    { month: 'Jul', peminjaman: 67, pengembalian: 63, terlambat: 6 },
    { month: 'Agu', peminjaman: 58, pengembalian: 55, terlambat: 3 },
    { month: 'Sep', peminjaman: 72, pengembalian: 68, terlambat: 5 },
    { month: 'Okt', peminjaman: 64, pengembalian: 61, terlambat: 4 },
    { month: 'Nov', peminjaman: 69, pengembalian: 65, terlambat: 5 },
    { month: 'Des', peminjaman: 58, pengembalian: 54, terlambat: 4 },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'meminjam buku "Algoritma & Struktur Data"', time: '2 menit yang lalu', color: 'bg-blue-500' },
    { user: 'Admin', action: 'menambahkan 15 buku baru', time: '15 menit yang lalu', color: 'bg-green-500' },
    { user: 'Jane Smith', action: 'mengembalikan buku terlambat', time: '1 jam yang lalu', color: 'bg-orange-500' },
    { user: 'System', action: 'mengirim reminder keterlambatan', time: '2 jam yang lalu', color: 'bg-purple-500' },
  ];

  const topBooks = [
    { name: 'Algoritma & Pemrograman', author: 'Dr. Rinaldi Munir', borrowed: 23 },
    { name: 'Basis Data', author: 'Prof. Bambang', borrowed: 19 },
    { name: 'Jaringan Komputer', author: 'Dr. Siti', borrowed: 15 },
    { name: 'Machine Learning', author: 'Prof. Ahmad', borrowed: 12 },
  ];

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-start">
              <CardTitle>Statistik Peminjaman Bulanan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={borrowingData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="peminjaman" fill="#3b82f6" name="Peminjaman" />
                  <Bar dataKey="pengembalian" fill="#22c55e" name="Pengembalian" />
                  <Bar dataKey="terlambat" fill="#ef4444" name="Terlambat" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">687</p>
                <p className="text-xs text-muted-foreground">Total Peminjaman</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">647</p>
                <p className="text-xs text-muted-foreground">Total Pengembalian</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">47</p>
                <p className="text-xs text-muted-foreground">Total Terlambat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-0 pb-4">
            <div className="flex flex-col flex-1 justify-between">
              <Button className="w-full justify-start h-auto py-3" variant="default">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Tambah Buku Baru</p>
                    <p className="text-xs opacity-80">Input data buku ke sistem</p>
                  </div>
                </div>
              </Button>

              <Button className="w-full justify-start h-auto py-3" variant="outline">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Registrasi Anggota</p>
                    <p className="text-xs text-muted-foreground">Daftarkan mahasiswa baru</p>
                  </div>
                </div>
              </Button>

              <Button className="w-full justify-start h-auto py-3" variant="outline">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Proses Peminjaman</p>
                    <p className="text-xs text-muted-foreground">Scan kartu & buku</p>
                  </div>
                </div>
              </Button>

              <Button className="w-full justify-start h-auto py-3" variant="outline">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Lihat Laporan</p>
                    <p className="text-xs text-muted-foreground">Statistik & analitik</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Quick Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Update terkini sistem perpustakaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buku Terpopuler</CardTitle>
            <CardDescription>Buku paling banyak dipinjam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div key={index} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white flex-shrink-0">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{book.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {book.borrowed}x
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Buku</CardTitle>
            <CardDescription>Distribusi buku per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Pemrograman', count: 85, percentage: 35 },
                { name: 'Database', count: 62, percentage: 26 },
                { name: 'Jaringan', count: 48, percentage: 20 },
                { name: 'AI & Machine Learning', count: 45, percentage: 19 },
              ].map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.count} buku</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${category.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Peminjaman Aktif</CardTitle>
          <CardDescription>Daftar buku yang sedang dipinjam</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Anggota</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buku</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tanggal Pinjam</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Jatuh Tempo</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { borrower: 'Ahmad Fauzi', book: 'Clean Code', borrowDate: '2025-11-25', dueDate: '2025-12-09', status: 'late' },
                  { borrower: 'Ahmad Fauzi', book: 'Sapiens', borrowDate: '2025-11-28', dueDate: '2025-12-12', status: 'late' },
                  { borrower: 'Siti Nurhaliza', book: 'The Great Gatsby', borrowDate: '2025-11-20', dueDate: '2025-12-04', status: 'late' },
                  { borrower: 'Budi Santoso', book: 'Algoritma & Struktur Data', borrowDate: '2025-12-08', dueDate: '2025-12-22', status: 'normal' },
                  { borrower: 'Dewi Lestari', book: 'Basis Data Lanjut', borrowDate: '2025-12-10', dueDate: '2025-12-24', status: 'normal' },
                ].map((loan, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">{loan.borrower}</td>
                    <td className="py-3 px-4">{loan.book}</td>
                    <td className="py-3 px-4 text-muted-foreground">{loan.borrowDate}</td>
                    <td className="py-3 px-4 text-muted-foreground">{loan.dueDate}</td>
                    <td className="py-3 px-4">
                      <Badge variant={loan.status === 'late' ? 'destructive' : 'secondary'}>{loan.status === 'late' ? 'Terlambat' : 'Normal'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
