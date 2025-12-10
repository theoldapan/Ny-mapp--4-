import { apiFetch } from "./api";
import { Facility } from "../types";

export const facilityService = {
  getAll: async (): Promise<Facility[]> => {
    try {
      const response = await apiFetch<Facility[]>("/facilities");
      return response;
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      return [];
    }
  },
};
