// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import logo from '@/public/logo-puba.png';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Email dan password harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      // Clear any existing auth data first
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      const response = await authService.login({ email, password });
      
      // Backend returns: { message, token, user: { id, email, role } }
      if (response.token && response.user) {
        const role = response.user.role;
        toast.success(`Login berhasil sebagai ${role === 'admin' ? 'Admin' : 'Mahasiswa'}!`);
        
        // Small delay to ensure token is saved
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on role
        if (role === 'admin') {
          window.location.href = '/admin';
        } else if (role === 'mahasiswa') {
          window.location.href = '/dashboard';
        } else {
          toast.error('Role tidak dikenali: ' + role);
        }
      } else {
        toast.error('Login gagal: Data tidak lengkap dari server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Terjadi kesalahan saat login';
      
      // Berikan pesan yang lebih spesifik
      if (errorMsg.includes('Password salah') || errorMsg.includes('password')) {
        toast.error('Password yang Anda masukkan salah');
      } else if (errorMsg.includes('Email tidak ditemukan') || errorMsg.includes('email')) {
        toast.error('Email tidak terdaftar');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center rounded-full">
            <Image src={logo} alt="Puba Connect Logo" width={120} height={120}/>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">PUBA Connect</h1>
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
              <Input 
                id="email" 
                type="text" 
                placeholder="Masukkan email atau NIM" 
                className="h-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="h-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <div className="space-y-2 pt-2">
              <Button 
                onClick={handleLogin} 
                className="w-full h-9"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login'}
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
