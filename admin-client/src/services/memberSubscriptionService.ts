import { MemberSubscription } from '@/types';
import { apiFetch } from './api';

export const memberSubscriptionService = {
  getByMemberId: async (memberId: string): Promise<MemberSubscription | null> => {
    try {
      return await apiFetch<MemberSubscription>(`/member-subscriptions/member/${memberId}`);
    } catch {
      return null;
    }
  },

  getAll: async (): Promise<MemberSubscription[]> => {
    return apiFetch<MemberSubscription[]>('/member-subscriptions');
  },

  create: async (subscription: Omit<MemberSubscription, 'id'>): Promise<MemberSubscription> => {
    return apiFetch<MemberSubscription>('/member-subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  },

  update: async (id: string, subscription: Partial<MemberSubscription>): Promise<MemberSubscription> => {
    return apiFetch<MemberSubscription>(`/member-subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subscription),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/member-subscriptions/${id}`, {
      method: 'DELETE',
    });
  },
};
