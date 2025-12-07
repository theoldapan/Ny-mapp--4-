import { SubscriptionPlan } from '@/types';
import { apiFetch } from './api';

export const subscriptionService = {
  getAll: async (): Promise<SubscriptionPlan[]> => {
    return apiFetch<SubscriptionPlan[]>('/subscriptions/plans');
  },

  getById: async (id: string): Promise<SubscriptionPlan> => {
    return apiFetch<SubscriptionPlan>(`/subscriptions/plans/${id}`);
  },

  create: async (plan: Omit<SubscriptionPlan, 'id' | 'createdAt'>): Promise<SubscriptionPlan> => {
    return apiFetch<SubscriptionPlan>('/subscriptions/plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  update: async (id: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return apiFetch<SubscriptionPlan>(`/subscriptions/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/subscriptions/plans/${id}`, {
      method: 'DELETE',
    });
  },
};
