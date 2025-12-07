import { GymClass, ClassRegistration } from "@/types";
import { apiFetch } from "./api";

export const classService = {
  getAll: async (): Promise<GymClass[]> => {
    return apiFetch<GymClass[]>("/classes");
  },

  getById: async (id: string): Promise<GymClass> => {
    return apiFetch<GymClass>(`/classes/${id}`);
  },

  create: async (
    gymClass: Omit<GymClass, "id" | "createdAt" | "enrolled">
  ): Promise<GymClass> => {
    return apiFetch<GymClass>("/classes", {
      method: "POST",
      body: JSON.stringify(gymClass),
    });
  },

  update: async (
    id: string,
    gymClass: Partial<GymClass>
  ): Promise<GymClass> => {
    return apiFetch<GymClass>(`/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(gymClass),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/classes/${id}`, {
      method: "DELETE",
    });
  },

  getRegistrations: async (classId: string): Promise<ClassRegistration[]> => {
    return apiFetch<ClassRegistration[]>(`/classes/${classId}/registrations`);
  },
};
