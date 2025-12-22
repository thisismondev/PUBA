import apiClient from '@/lib/api-client';
import { User, UpdateUserRequest, InsertMahasiswaRequest, Fakultas } from '@/types/api';

export const usersService = {
  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/user/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/users/user/update`, {
      idUser: id,
      ...data,
    });
    return response.data;
  },

  async insertMahasiswa(data: InsertMahasiswaRequest): Promise<any> {
    const response = await apiClient.post('/users/user/insert', data);
    return response.data;
  },

  async getFakultas(): Promise<Fakultas[]> {
    const response = await apiClient.get<Fakultas[]>('/users/fakultas');
    return response.data;
  },
};
