import { BlogPost } from "../types";
import { apiFetch } from "./api";

export const blogService = {
  getAll: async (): Promise<BlogPost[]> => {
    return apiFetch<BlogPost[]>("/blog");
  },

  getById: async (id: string): Promise<BlogPost> => {
    return apiFetch<BlogPost>(`/blog/${id}`);
  },

  create: async (
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  ): Promise<BlogPost> => {
    return apiFetch<BlogPost>("/blog", {
      method: "POST",
      body: JSON.stringify(post),
    });
  },

  update: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    return apiFetch<BlogPost>(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/blog/${id}`, {
      method: "DELETE",
    });
  },

  publish: async (id: string): Promise<BlogPost> => {
    return apiFetch<BlogPost>(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: "Published",
        publishedAt: new Date().toISOString(),
      }),
    });
  },
};
