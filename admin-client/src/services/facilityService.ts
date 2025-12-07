import { Facility } from '@/types';
import { apiFetch } from './api';

export const facilityService = {
  getAll: async (): Promise<Facility[]> => {
    return apiFetch<Facility[]>('/facilities');
  },

  getById: async (id: string): Promise<Facility> => {
    return apiFetch<Facility>(`/facilities/${id}`);
  },

  create: async (facility: Omit<Facility, 'id'>): Promise<Facility> => {
    return apiFetch<Facility>('/facilities', {
      method: 'POST',
      body: JSON.stringify(facility),
    });
  },

  update: async (id: string, facility: Partial<Facility>): Promise<Facility> => {
    return apiFetch<Facility>(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(facility),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/facilities/${id}`, {
      method: 'DELETE',
    });
  },
};
