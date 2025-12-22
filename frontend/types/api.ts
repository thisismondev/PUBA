// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  category?: string;
  cover_url?: string;
  created_at: string;
  updated_at: string;
  items?: BookItem[];
  // Computed fields
  totalCopies?: number;
  availableCopies?: number;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  category?: string;
  cover_url?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  category?: string;
  cover_url?: string;
}

export interface BookStats {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
}

// Book Item Types
export interface BookItem {
  id: string;
  book_id: string;
  inventory_code: string;
  status: 'available' | 'borrowed' | 'lost' | 'repair';
  rack_location?: string;
  created_at: string;
  updated_at: string;
  book?: {
    id: string;
    title: string;
    author: string;
  };
}

export interface CreateBookItemRequest {
  book_id: number;
  inventory_code: string;
  status?: 'available' | 'borrowed' | 'lost' | 'repair';
  rack_location?: string;
}

// Loan Types
export interface Loan {
  id: string;
  user_id: string;
  book_item_id: string;
  loan_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue';
  bookItem?: BookItem;
  book?: Book;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface CreateLoanRequest {
  book_item_id: number;
}

export interface ReturnLoanRequest {
  returnDate?: string;
}

// User Types
export interface User {
  idUser: string;
  username: string;
  email: string;
  role: string;
  fakultas?: string;
  createdAt: string;
}

export interface InsertMahasiswaRequest {
  idUser: string;
  nama: string;
  nim: string;
  fakultas: string;
  prodi: string;
  angkatan: number;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface Fakultas {
  idFakultas: string;
  namaFakultas: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
