import apiClient from '@/lib/api-client';
import { Loan, CreateLoanRequest, ReturnLoanRequest } from '@/types/api';

export const loansService = {
  async createLoan(data: CreateLoanRequest): Promise<Loan> {
    const response = await apiClient.post<Loan>('/loans/api/loans', data);
    return response.data;
  },

  async getMyLoans(): Promise<Loan[]> {
    const response = await apiClient.get<Loan[]>('/loans/api/loans/my');
    return response.data;
  },

  async getLoan(id: string): Promise<Loan> {
    const response = await apiClient.get<Loan>(`/loans/api/loans/${id}`);
    return response.data;
  },

  async getAllLoans(): Promise<Loan[]> {
    const response = await apiClient.get<Loan[]>('/loans/api/loans');
    return response.data;
  },

  async returnBook(id: string, data?: ReturnLoanRequest): Promise<Loan> {
    const response = await apiClient.post<Loan>(`/loans/api/loans/${id}/return`, data || {});
    return response.data;
  },
};
