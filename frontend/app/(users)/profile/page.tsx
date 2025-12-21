'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Clock, Edit } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Ahmad Fauzi',
    nim: 'STD001',
    email: 'ahmad.fauzi@email.com',
    phone: '081234567890',
    address: 'Jl. Merdeka No. 123, Jakarta',
    joinDate: '2024-01-15',
  });

  const stats = [
    { label: 'Total Peminjaman', value: '18', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Sedang Dipinjam', value: '3', icon: Clock, color: 'text-orange-600' },
    { label: 'Selesai', value: '15', icon: BookOpen, color: 'text-emerald-600' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: API call to update profile
    console.log('Save profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-sm md:text-base text-muted-foreground">Kelola informasi pribadi dan statistik peminjaman Anda</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg md:text-xl">Informasi Pribadi</CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Batal
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Simpan
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl md:text-4xl">
                  {formData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold">{formData.name}</h2>
                <p className="text-sm text-muted-foreground">NIM: {formData.nim}</p>
                <Badge variant="secondary" className="mt-2">
                  Anggota Aktif
                </Badge>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input id="nim" name="nim" value={formData.nim} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Tanggal Bergabung</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="joinDate" value={formData.joinDate} disabled className="bg-muted pl-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik Peminjaman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-xl font-bold">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Keanggotaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary">Aktif</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Masa Aktif:</span>
                <span className="font-medium">Selamanya</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Denda:</span>
                <span className="font-medium text-red-600">Rp 0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
