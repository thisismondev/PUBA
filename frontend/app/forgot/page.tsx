// app/forgot/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Lupa Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Reset password akun Anda</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reset Password</CardTitle>
            <CardDescription className="text-sm">Masukkan email Anda untuk menerima link reset password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input id="email" type="email" placeholder="nama@example.com" className="h-9" />
            </div>

            <Button className="w-full h-9">Kirim Link Reset</Button>

            <Link href="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
