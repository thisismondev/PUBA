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
import { useState, useEffect } from 'react';
import { booksService } from '@/services/books.service';
import { Book } from '@/types/api';
import { toast } from 'sonner';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Teknologi',
    year: new Date().getFullYear().toString(),
    isbn: '',
    publisher: '',
    total: '1',
    cover_url: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await booksService.getBooks();
      
      // Fetch book items untuk setiap buku dan hitung ketersediaan
      const booksWithAvailability = await Promise.all(
        data.map(async (book) => {
          try {
            const items = await booksService.getBookItemsByBook(book.id);
            return {
              ...book,
              totalCopies: items.length,
              availableCopies: items.filter(item => item.status === 'available').length,
            };
          } catch {
            return {
              ...book,
              totalCopies: 0,
              availableCopies: 0,
            };
          }
        })
      );
      
      setBooks(booksWithAvailability);
    } catch (error: any) {
      console.error('Error loading books:', error);
      toast.error('Gagal memuat data buku');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create book first
      const newBook = await booksService.createBook({
        title: formData.title,
        author: formData.author,
        category: formData.category,
        publication_year: parseInt(formData.year),
        isbn: formData.isbn,
        publisher: formData.publisher,
        cover_url: formData.cover_url,
      });

      // Create book items based on total
      const totalItems = parseInt(formData.total);
      const createItemPromises = [];
      for (let i = 1; i <= totalItems; i++) {
        const inventoryCode = `${formData.isbn || 'BK'}-${Date.now()}-${i}`;
        createItemPromises.push(
          booksService.createBookItem({
            book_id: parseInt(newBook.id),
            inventory_code: inventoryCode,
            status: 'available',
          })
        );
      }
      await Promise.all(createItemPromises);

      toast.success(`Buku berhasil ditambahkan dengan ${totalItems} eksemplar`);
      setIsAddDialogOpen(false);
      loadBooks();
      // Reset form
      setFormData({
        title: '',
        author: '',
        category: 'Teknologi',
        year: new Date().getFullYear().toString(),
        isbn: '',
        publisher: '',
        total: '1',
        cover_url: '',
      });
    } catch (error: any) {
      console.error('Error creating book:', error);
      toast.error(error.response?.data?.message || 'Gagal menambahkan buku');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category || 'Teknologi',
      year: book.publication_year?.toString() || new Date().getFullYear().toString(),
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      total: book.totalCopies?.toString() || '1',
      cover_url: book.cover_url || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    setIsSubmitting(true);
    try {
      // Update book data
      await booksService.updateBook(selectedBook.id, {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        publication_year: parseInt(formData.year),
        isbn: formData.isbn,
        publisher: formData.publisher,
        cover_url: formData.cover_url,
      });

      // Check if total has increased, add new items
      const newTotal = parseInt(formData.total);
      const currentTotal = selectedBook.totalCopies || 0;
      
      if (newTotal > currentTotal) {
        const itemsToAdd = newTotal - currentTotal;
        const createItemPromises = [];
        for (let i = 1; i <= itemsToAdd; i++) {
          const inventoryCode = `${formData.isbn || selectedBook.id}-${Date.now()}-${currentTotal + i}`;
          createItemPromises.push(
            booksService.createBookItem({
              book_id: parseInt(selectedBook.id),
              inventory_code: inventoryCode,
              status: 'available',
            })
          );
        }
        await Promise.all(createItemPromises);
        toast.success(`Buku diperbarui dan ${itemsToAdd} eksemplar baru ditambahkan`);
      } else {
        toast.success('Buku berhasil diperbarui');
      }

      setIsEditDialogOpen(false);
      setSelectedBook(null);
      loadBooks();
      // Reset form
      setFormData({
        title: '',
        author: '',
        category: 'Teknologi',
        year: new Date().getFullYear().toString(),
        isbn: '',
        publisher: '',
        total: '1',
        cover_url: '',
      });
    } catch (error: any) {
      console.error('Error updating book:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui buku');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;
    try {
      await booksService.deleteBook(selectedBook.id);
      toast.success('Buku berhasil dihapus');
      setIsDeleteDialogOpen(false);
      setSelectedBook(null);
      loadBooks();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus buku');
    }
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
                        <Label htmlFor="total">Jumlah Buku *</Label>
                        <Input id="total" name="total" type="number" placeholder="1" value={formData.total} onChange={handleInputChange} required min="1" />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="cover_url">URL Gambar Cover</Label>
                        <Input id="cover_url" name="cover_url" placeholder="https://example.com/cover.jpg" value={formData.cover_url} onChange={handleInputChange} />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                        Batal
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Menambahkan...' : 'Tambah Buku'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Memuat data buku...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all' ? 'Tidak ada buku yang sesuai filter' : 'Belum ada buku'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            {/* Book Cover */}
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center overflow-hidden">
              {book.cover_url ? (
                <img 
                  src={book.cover_url} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <BookOpen className={`h-20 w-20 text-white/80 ${book.cover_url ? 'hidden' : ''}`} />
            </div>

            {/* Book Info */}
            <CardContent className="p-3 space-y-2">
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                <span className="text-muted-foreground">{book.publication_year}</span>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ketersediaan:</span>
                <span className="font-medium">{book.availableCopies || 0} dari {book.totalCopies || 0}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs px-2" onClick={() => handleEdit(book)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs px-2 text-destructive hover:text-destructive" onClick={() => handleDelete(book)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

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
                <Label htmlFor="edit-total">Jumlah Buku *</Label>
                <Input 
                  id="edit-total" 
                  name="total" 
                  type="number" 
                  placeholder="1" 
                  value={formData.total} 
                  onChange={handleInputChange}
                  required
                  min={selectedBook?.totalCopies || 1}
                />
                <p className="text-xs text-muted-foreground">
                  Saat ini: {selectedBook?.totalCopies || 0} eksemplar. Anda hanya bisa menambah, tidak bisa mengurangi.
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-cover_url">URL Gambar Cover</Label>
                <Input id="edit-cover_url" name="cover_url" placeholder="https://example.com/cover.jpg" value={formData.cover_url} onChange={handleInputChange} />
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
