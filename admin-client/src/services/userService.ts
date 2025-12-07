import { User } from "@/types";
import { apiFetch } from "./api";

export const userService = {
  getAll: async (): Promise<User[]> => {
    return apiFetch<User[]>("/User");
  },

  getById: async (id: string): Promise<User> => {
    return apiFetch<User>(`/User/${id}`);
  },

  create: async (user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  }): Promise<User> => {
    return apiFetch<User>("/User", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    return apiFetch<User>(`/User/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/User/${id}`, {
      method: "DELETE",
    });
  },
};
