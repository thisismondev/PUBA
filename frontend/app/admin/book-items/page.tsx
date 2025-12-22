'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Pencil, Trash2, MoreVertical, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { booksService } from '@/services/books.service';
import { BookItem, Book } from '@/types/api';
import { toast } from 'sonner';

export default function BookItemsPage() {
  const [bookItems, setBookItems] = useState<BookItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BookItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    book_id: '',
    inventory_code: '',
    status: 'available',
    rack_location: '',
  });
  const [bookSearchQuery, setBookSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [itemsData, booksData] = await Promise.all([
        booksService.getAllBookItems(),
        booksService.getBooks()
      ]);
      setBookItems(itemsData);
      setBooks(booksData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat data item buku');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = bookItems.filter((item) => {
    const matchesSearch = 
      item.inventory_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.book?.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.book_id || !formData.inventory_code) {
      toast.error('Buku dan kode inventaris harus diisi');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await booksService.createBookItem({
        book_id: parseInt(formData.book_id),
        inventory_code: formData.inventory_code,
        status: formData.status,
        rack_location: formData.rack_location || undefined,
      });
      toast.success('Item buku berhasil ditambahkan');
      setIsAddDialogOpen(false);
      loadData();
      // Reset form
      setFormData({
        book_id: '',
        inventory_code: '',
        status: 'available',
        rack_location: '',
      });
    } catch (error: any) {
      console.error('Error creating book item:', error);
      toast.error(error.response?.data?.message || 'Gagal menambahkan item buku');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: BookItem) => {
    setSelectedItem(item);
    setFormData({
      book_id: item.book_id,
      inventory_code: item.inventory_code,
      status: item.status,
      rack_location: item.rack_location || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await booksService.updateBookItemStatus(selectedItem.id, formData.status);
      toast.success('Status item berhasil diperbarui');
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      loadData();
      setFormData({
        book_id: '',
        inventory_code: '',
        status: 'available',
        rack_location: '',
      });
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui status item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      available: <Badge className="bg-green-500">Tersedia</Badge>,
      borrowed: <Badge className="bg-blue-500">Dipinjam</Badge>,
      repair: <Badge className="bg-yellow-500">Perbaikan</Badge>,
      lost: <Badge className="bg-red-500">Hilang</Badge>,
    };
    return badges[status as keyof typeof badges] || <Badge>{status}</Badge>;
  };

  const stats = {
    total: bookItems.length,
    available: bookItems.filter((i) => i.status === 'available').length,
    borrowed: bookItems.filter((i) => i.status === 'borrowed').length,
    others: bookItems.filter((i) => !['available', 'borrowed'].includes(i.status)).length,
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Item Buku</h2>
        <p className="text-muted-foreground">Kelola item fisik buku untuk peminjaman</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dipinjam</CardTitle>
            <div className="h-3 w-3 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borrowed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lainnya</CardTitle>
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.others}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan kode inventaris atau judul buku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[150px] justify-between">
                    {statusFilter === 'all' ? 'Semua Status' : 
                     statusFilter === 'available' ? 'Tersedia' :
                     statusFilter === 'borrowed' ? 'Dipinjam' :
                     statusFilter === 'repair' ? 'Perbaikan' : 'Hilang'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>Semua Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('available')}>Tersedia</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('borrowed')}>Dipinjam</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('repair')}>Perbaikan</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('lost')}>Hilang</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Item
                </Button>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Tambah Item Buku</DialogTitle>
                      <DialogDescription>Tambahkan item fisik buku untuk peminjaman</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="book_id">Pilih Buku *</Label>
                        <div className="space-y-3">
                          {/* Search Input */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Cari buku berdasarkan judul atau penulis..."
                              value={bookSearchQuery}
                              onChange={(e) => setBookSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          
                          {/* Books Grid */}
                          <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                            {books
                              .filter(book => 
                                book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
                                book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
                              )
                              .map((book) => (
                                <div
                                  key={book.id}
                                  onClick={() => setFormData(prev => ({ ...prev, book_id: book.id }))}
                                  className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-b-0 ${
                                    formData.book_id === book.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {book.cover_url ? (
                                      <img 
                                        src={book.cover_url} 
                                        alt={book.title}
                                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                                      />
                                    ) : (
                                      <div className="w-12 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded flex items-center justify-center flex-shrink-0">
                                        <Package className="h-6 w-6 text-white" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm truncate">{book.title}</h4>
                                      <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {book.category || 'Umum'}
                                        </Badge>
                                        {book.isbn && (
                                          <span className="text-xs text-muted-foreground">ISBN: {book.isbn}</span>
                                        )}
                                      </div>
                                    </div>
                                    {formData.book_id === book.id && (
                                      <div className="flex-shrink-0">
                                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            {books.filter(book => 
                              book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
                              book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <div className="p-8 text-center text-muted-foreground">
                                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Tidak ada buku yang sesuai</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="inventory_code">Kode Inventaris *</Label>
                          <Input
                            id="inventory_code"
                            name="inventory_code"
                            placeholder="Contoh: BK-001-2024-01"
                            value={formData.inventory_code}
                            onChange={handleInputChange}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Format: BK-ISBN-Tahun-Nomor
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Tersedia</SelectItem>
                              <SelectItem value="repair">Perbaikan</SelectItem>
                              <SelectItem value="lost">Hilang</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rack_location">Lokasi Rak</Label>
                        <Input
                          id="rack_location"
                          name="rack_location"
                          placeholder="Contoh: A1-Shelf-03"
                          value={formData.rack_location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                        Batal
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Item Buku</CardTitle>
          <CardDescription>
            {filteredItems.length} item ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || statusFilter !== 'all' ? 'Tidak ada item yang sesuai dengan filter' : 'Belum ada item buku'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium">{item.inventory_code}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{item.book?.title || 'Unknown Book'}</span> - {item.book?.author}
                    </p>
                    {item.rack_location && (
                      <p className="text-xs text-muted-foreground mt-1">📍 {item.rack_location}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Ubah Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Ubah Status Item</DialogTitle>
              <DialogDescription>
                {selectedItem?.inventory_code} - {selectedItem?.book?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Tersedia</SelectItem>
                    <SelectItem value="borrowed">Dipinjam</SelectItem>
                    <SelectItem value="repair">Perbaikan</SelectItem>
                    <SelectItem value="lost">Hilang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
