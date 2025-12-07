import { Member } from '@/types';
import { apiFetch } from './api';

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    return apiFetch<Member[]>('/members');
  },

  getById: async (id: string): Promise<Member> => {
    return apiFetch<Member>(`/members/${id}`);
  },

  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    return apiFetch<Member>('/members', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  },

  update: async (id: string, member: Partial<Member>): Promise<Member> => {
    return apiFetch<Member>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/members/${id}`, {
      method: 'DELETE',
    });
  },
};
