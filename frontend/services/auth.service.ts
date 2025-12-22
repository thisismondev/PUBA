import apiClient, { setToken, removeToken, setUserRole, removeUserRole } from '@/lib/api-client';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/users/login', credentials);
    
    if (response.data.token && response.data.user) {
      setToken(response.data.token);
      setUserRole(response.data.user.role);
    }
    
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/users/regist', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/users/logout');
    } finally {
      removeToken();
      removeUserRole();
    }
  },
};
