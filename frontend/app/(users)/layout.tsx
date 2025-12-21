import UserHeader from '@/components/user-header';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1 bg-muted/40">{children}</main>
    </div>
  );
}
