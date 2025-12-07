import { DashboardStats } from '@/types';
import { apiFetch } from './api';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiFetch<DashboardStats>('/dashboard/stats');
  },
};
