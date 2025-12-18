// components/AdminHeader.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminHeader() {
  const pathname = usePathname();

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

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">3</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
