'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Plus, Pencil, Trash2, MoreVertical, ChevronDown } from 'lucide-react';
import { useState } from 'react';

type Member = {
  id: number;
  name: string;
  nim: string;
  email: string;
  phone?: string;
  address?: string;
  status: string;
  borrowCount: number;
  fine: number;
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    email: '',
    phone: '',
    address: '',
    status: 'Aktif',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to add member
    console.log('Member data:', formData);
    setIsAddDialogOpen(false);
    // Reset form
    setFormData({
      name: '',
      nim: '',
      email: '',
      phone: '',
      address: '',
      status: 'Aktif',
    });
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      nim: member.nim,
      email: member.email,
      phone: member.phone || '',
      address: member.address || '',
      status: member.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update member
    console.log('Update member:', selectedMember?.id, formData);
    setIsEditDialogOpen(false);
    setSelectedMember(null);
    // Reset form
    setFormData({
      name: '',
      nim: '',
      email: '',
      phone: '',
      address: '',
      status: 'Aktif',
    });
  };

  const handleDelete = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement API call to delete member
    console.log('Delete member:', selectedMember?.id);
    setIsDeleteDialogOpen(false);
    setSelectedMember(null);
  };

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

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrasi Anggota
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Registrasi Anggota Baru</DialogTitle>
                    <DialogDescription>Isi informasi lengkap anggota yang akan didaftarkan.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input id="name" name="name" placeholder="Masukkan nama lengkap" value={formData.name} onChange={handleInputChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nim">NIM/ID *</Label>
                        <Input id="nim" name="nim" placeholder="Masukkan NIM atau ID" value={formData.nim} onChange={handleInputChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input id="phone" name="phone" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Input id="address" name="address" placeholder="Masukkan alamat" value={formData.address} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {formData.status}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            <DropdownMenuItem onClick={() => handleStatusChange('Aktif')}>Aktif</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('Lulus')}>Lulus</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('Drop Out')}>Drop Out</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button type="submit">Daftarkan</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
                        <DropdownMenuItem className="gap-2" onClick={() => handleEdit(member)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(member)}>
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

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Anggota</DialogTitle>
            <DialogDescription>Perbarui informasi anggota yang ingin diubah.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap *</Label>
                <Input id="edit-name" name="name" placeholder="Masukkan nama lengkap" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-nim">NIM/ID *</Label>
                <Input id="edit-nim" name="nim" placeholder="Masukkan NIM atau ID" value={formData.nim} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input id="edit-email" name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">No. Telepon</Label>
                <Input id="edit-phone" name="phone" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Alamat</Label>
                <Input id="edit-address" name="address" placeholder="Masukkan alamat" value={formData.address} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {formData.status}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => handleStatusChange('Aktif')}>Aktif</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('Lulus')}>Lulus</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('Drop Out')}>Drop Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus anggota <strong>{selectedMember?.name}</strong> (NIM: {selectedMember?.nim})? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
