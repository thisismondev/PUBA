'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Pencil, Trash2, MoreVertical, ChevronDown, BookOpen } from 'lucide-react';
import { useState } from 'react';

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  year: number;
  available: number;
  total: number;
  isbn?: string;
  publisher?: string;
  description?: string;
};

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Teknologi',
    year: new Date().getFullYear().toString(),
    isbn: '',
    publisher: '',
    total: '1',
    description: '',
  });

  const books = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Teknologi',
      year: 2008,
      available: 3,
      total: 5,
    },
    {
      id: 2,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiksi',
      year: 1925,
      available: 2,
      total: 3,
    },
    {
      id: 3,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      category: 'Non-Fiksi',
      year: 2011,
      available: 1,
      total: 4,
    },
    {
      id: 4,
      title: 'Algoritma & Struktur Data',
      author: 'Dr. Rinaldi Munir',
      category: 'Teknologi',
      year: 2020,
      available: 4,
      total: 6,
    },
    {
      id: 5,
      title: 'Basis Data Lanjut',
      author: 'Prof. Bambang',
      category: 'Teknologi',
      year: 2019,
      available: 2,
      total: 5,
    },
    {
      id: 6,
      title: 'Matematika Diskrit',
      author: 'Dr. Ahmad',
      category: 'Matematika',
      year: 2018,
      available: 3,
      total: 4,
    },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = statusFilter === 'all' || book.category.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to add book
    console.log('Book data:', formData);
    setIsAddDialogOpen(false);
    // Reset form
    setFormData({
      title: '',
      author: '',
      category: 'Teknologi',
      year: new Date().getFullYear().toString(),
      isbn: '',
      publisher: '',
      total: '1',
      description: '',
    });
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      year: book.year.toString(),
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      total: book.total.toString(),
      description: book.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update book
    console.log('Update book:', selectedBook?.id, formData);
    setIsEditDialogOpen(false);
    setSelectedBook(null);
    // Reset form
    setFormData({
      title: '',
      author: '',
      category: 'Teknologi',
      year: new Date().getFullYear().toString(),
      isbn: '',
      publisher: '',
      total: '1',
      description: '',
    });
  };

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement API call to delete book
    console.log('Delete book:', selectedBook?.id);
    setIsDeleteDialogOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">Kelola koleksi berdasarkan judul atau penulis</p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari buku berdasarkan judul atau penulis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[150px] justify-between">
                    {statusFilter === 'all'
                      ? 'Semua Kategori'
                      : statusFilter === 'teknologi'
                      ? 'Teknologi'
                      : statusFilter === 'bahasa'
                      ? 'Bahasa'
                      : statusFilter === 'matematika'
                      ? 'Matematika'
                      : statusFilter === 'fiksi'
                      ? 'Fiksi'
                      : 'Non-Fiksi'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>Semua Kategori</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('teknologi')}>Teknologi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('fiksi')}>Fiksi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('non-fiksi')}>Non-Fiksi</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('matematika')}>Matematika</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Buku
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Buku Baru</DialogTitle>
                    <DialogDescription>Isi informasi lengkap buku yang akan ditambahkan ke perpustakaan.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">Judul Buku *</Label>
                        <Input id="title" name="title" placeholder="Masukkan judul buku" value={formData.title} onChange={handleInputChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author">Penulis *</Label>
                        <Input id="author" name="author" placeholder="Masukkan nama penulis" value={formData.author} onChange={handleInputChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input id="isbn" name="isbn" placeholder="978-3-16-148410-0" value={formData.isbn} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="publisher">Penerbit</Label>
                        <Input id="publisher" name="publisher" placeholder="Nama penerbit" value={formData.publisher} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Kategori *</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {formData.category}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            <DropdownMenuItem onClick={() => handleCategoryChange('Teknologi')}>Teknologi</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCategoryChange('Fiksi')}>Fiksi</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCategoryChange('Non-Fiksi')}>Non-Fiksi</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCategoryChange('Matematika')}>Matematika</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCategoryChange('Bahasa')}>Bahasa</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Tahun Terbit *</Label>
                        <Input id="year" name="year" type="number" placeholder="2024" value={formData.year} onChange={handleInputChange} required min="1900" max={new Date().getFullYear()} />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="total">Jumlah Eksemplar *</Label>
                        <Input id="total" name="total" type="number" placeholder="1" value={formData.total} onChange={handleInputChange} required min="1" />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea id="description" name="description" placeholder="Deskripsi singkat tentang buku..." value={formData.description} onChange={handleInputChange} rows={3} />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button type="submit">Tambah Buku</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            {/* Book Cover */}
            <div className="relative h-48 bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-white/80" />
            </div>

            {/* Book Info */}
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{book.category}</Badge>
                <span className="text-sm text-muted-foreground">{book.year}</span>
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ketersediaan:</p>
                <div className="flex items-center gap-2">
                  <Progress value={(book.available / book.total) * 100} className="flex-1" />
                  <span className="text-sm font-medium">
                    {book.available}/{book.total}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(book)}>
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(book)}>
                  <Trash2 className="mr-2 h-3 w-3" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Buku</DialogTitle>
            <DialogDescription>Perbarui informasi buku yang ingin diubah.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Judul Buku *</Label>
                <Input id="edit-title" name="title" placeholder="Masukkan judul buku" value={formData.title} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-author">Penulis *</Label>
                <Input id="edit-author" name="author" placeholder="Masukkan nama penulis" value={formData.author} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-isbn">ISBN</Label>
                <Input id="edit-isbn" name="isbn" placeholder="978-3-16-148410-0" value={formData.isbn} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-publisher">Penerbit</Label>
                <Input id="edit-publisher" name="publisher" placeholder="Nama penerbit" value={formData.publisher} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {formData.category}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => handleCategoryChange('Teknologi')}>Teknologi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCategoryChange('Fiksi')}>Fiksi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCategoryChange('Non-Fiksi')}>Non-Fiksi</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCategoryChange('Matematika')}>Matematika</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCategoryChange('Bahasa')}>Bahasa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-year">Tahun Terbit *</Label>
                <Input id="edit-year" name="year" type="number" placeholder="2024" value={formData.year} onChange={handleInputChange} required min="1900" max={new Date().getFullYear()} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-total">Jumlah Eksemplar *</Label>
                <Input id="edit-total" name="total" type="number" placeholder="1" value={formData.total} onChange={handleInputChange} required min="1" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea id="edit-description" name="description" placeholder="Deskripsi singkat tentang buku..." value={formData.description} onChange={handleInputChange} rows={3} />
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
            <AlertDialogTitle>Hapus Buku</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus buku <strong>{selectedBook?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
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
