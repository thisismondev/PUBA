// components/AdminHeader.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, BookOpen, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Buku Terlambat',
      message: 'Ahmad Fauzi memiliki 2 buku yang terlambat dikembalikan',
      time: '5 menit yang lalu',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Peminjaman Baru',
      message: 'Siti Nurhaliza meminjam buku "Sapiens"',
      time: '1 jam yang lalu',
      read: false,
    },
    {
      id: 3,
      type: 'success',
      title: 'Pengembalian Selesai',
      message: 'Budi Santoso mengembalikan buku "Clean Code"',
      time: '2 jam yang lalu',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mapping path ke title
  const getPageTitle = (path: string) => {
    const routes: { [key: string]: string } = {
      '/admin': 'Dashboard',
      '/admin/users': 'Manajemen Anggota',
      '/admin/books': 'Manajemen Buku',
      '/admin/return': 'Pengembalian',
      '/admin/borrowing': 'Peminjaman',
      '/admin/settings': 'Pengaturan',
      '/admin/notifications': 'Notifications',
    };

    return routes[path] || 'Dashboard';
  };

  const pageTitle = getPageTitle(pathname);

  const handleLogout = () => {
    // TODO: Clear session/token here
    // localStorage.removeItem('token');
    // sessionStorage.clear();
    router.push('/');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'info':
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case 'success':
        return <User className="h-5 w-5 text-emerald-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <div className="flex items-center gap-4">
          {/* Notification Sheet */}
          <Sheet open={isNotifOpen} onOpenChange={setIsNotifOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">{unreadCount}</span>}
                <Bell className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifikasi</SheetTitle>
                <SheetDescription>Anda memiliki {unreadCount} notifikasi yang belum dibaca</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`flex gap-3 p-3 rounded-lg border ${notif.read ? 'bg-background' : 'bg-muted/50'}`}>
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm">{notif.title}</p>
                        {!notif.read && <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logout Button */}
          <Button variant="outline" size="sm" onClick={() => setIsLogoutDialogOpen(true)}>
            Logout
          </Button>

          {/* Logout Confirmation Dialog */}
          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                <AlertDialogDescription>Apakah Anda yakin ingin keluar dari sistem? Anda perlu login kembali untuk mengakses dashboard.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Ya, Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}
