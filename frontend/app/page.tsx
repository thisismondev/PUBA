// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleAdminLogin = () => {
    router.push('/admin');
  };

  const handleStudentLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Puba Connect</h1>
          <p className="text-sm text-muted-foreground mt-1">Perpustakaan Utsman bin Affan</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Login</CardTitle>
            <CardDescription className="text-sm">Masuk ke akun perpustakaan Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email / NIM
              </Label>
              <Input id="email" type="text" placeholder="Masukkan email atau NIM" className="h-9" />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-9" />
            </div>

            {/* Login Buttons */}
            <div className="space-y-2 pt-2">
              <Button onClick={handleAdminLogin} className="w-full h-9">
                Login sebagai Admin
              </Button>
              <Button onClick={handleStudentLogin} variant="outline" className="w-full h-9">
                Login sebagai Mahasiswa
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-1.5 text-xs text-muted-foreground pt-4">
            <Link href="/forgot" className="hover:underline">
              Lupa password?
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
