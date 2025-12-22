import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Token management helpers
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  // Also set as cookie for middleware
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  // Remove cookie
  document.cookie = 'token=; path=/; max-age=0';
};

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole');
};

export const setUserRole = (role: string): void => {
  if (typeof window === 'undefined') return;
  console.log('Setting user role:', role); // Debug log
  localStorage.setItem('userRole', role);
  // Also set as cookie for middleware
  document.cookie = `userRole=${role}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  console.log('Cookie set:', document.cookie); // Debug cookie
};

export const removeUserRole = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('userRole');
  // Remove cookie
  document.cookie = 'userRole=; path=/; max-age=0';
};

export default apiClient;
