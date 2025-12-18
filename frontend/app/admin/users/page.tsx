'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, Pencil, Trash2, MoreVertical, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const members = [
    {
      id: 1,
      name: 'Ahmad Fauzi',
      nim: 'STD001',
      email: 'ahmad.fauzi@email.com',
      status: 'Aktif',
      borrowCount: 2,
      fine: 0,
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      nim: 'STD002',
      email: 'siti.nur@email.com',
      status: 'Aktif',
      borrowCount: 1,
      fine: 15000,
    },
    {
      id: 3,
      name: 'Budi Santoso',
      nim: 'STD003',
      email: 'budi.santoso@email.com',
      status: 'Drop Out',
      borrowCount: 0,
      fine: 0,
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || member.nim.toLowerCase().includes(searchQuery.toLowerCase()) || member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">Kelola data anggota perpustakaan</p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari nama, NIM, atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[150px] justify-between">
                    {statusFilter === 'all' ? 'Semua Status' : statusFilter === 'aktif' ? 'Aktif' : statusFilter === 'lulus' ? 'Lulus' : 'Drop Out'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>Semua Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('aktif')}>Aktif</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('lulus')}>Lulus</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('dropout')}>Drop Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Registrasi Anggota
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Nama</TableHead>
                <TableHead className="font-semibold">NIM/ID</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">Jumlah Pinjaman</TableHead>
                <TableHead className="font-semibold">Denda</TableHead>
                <TableHead className="font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">{member.nim}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{member.borrowCount}</TableCell>
                  <TableCell>
                    <span className={member.fine > 0 ? 'text-destructive font-medium' : ''}>{member.fine > 0 ? `Rp ${member.fine.toLocaleString('id-ID')}` : 'Rp 0'}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
