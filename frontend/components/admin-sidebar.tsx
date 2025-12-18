// components/ui/app-sidebar.tsx
'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from '@/components/ui/sidebar';
import { BookOpen, LayoutDashboard, Users, ArrowLeftRight, ArrowRightLeft, FileText, Settings, BarChart3, ShoppingCart, Package, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    title: 'Dashboard',
    url: '/admin/',
    icon: LayoutDashboard,
  },
  {
    title: 'Manajemen Buku',
    url: '/admin/books',
    icon: BookOpen,
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'Peminjaman',
    url: '/admin/borrowing',
    icon: ArrowRightLeft,
  },
  {
    title: 'Pengembalian',
    url: '/admin/return',
    icon: ArrowLeftRight,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Puba Connect</h2>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Normalize pathname comparison to handle trailing slash
                const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
                const normalizedUrl = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
                const isActive = normalizedPathname === normalizedUrl || pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">AD</div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
