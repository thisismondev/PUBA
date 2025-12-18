// app/admin/layout.tsx
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin-sidebar';
import AdminHeader from '@/components/admin-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 bg-muted/40">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
