import { Member } from "@/types";
import { apiFetch } from "./api";

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    return apiFetch<Member[]>("/members");
  },

  getById: async (id: string): Promise<Member> => {
    return apiFetch<Member>(`/members/${id}`);
  },

  create: async (member: Omit<Member, "id">): Promise<Member> => {
    const cleanData: any = {
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone || "",
      dateOfBirth: member.dateOfBirth,
      gender: member.gender,
      address: member.address || "",
      city: member.city || "",
      postalCode: member.postalCode || "",
      membershipStatus: member.membershipStatus,
    };

    if (member.emergencyContact) {
      cleanData.emergencyContact = member.emergencyContact;
    }
    if (member.emergencyPhone) {
      cleanData.emergencyPhone = member.emergencyPhone;
    }
    if (member.notes) {
      cleanData.notes = member.notes;
    }

    return apiFetch<Member>("/members", {
      method: "POST",
      body: JSON.stringify(cleanData),
    });
  },

  update: async (id: string, member: Partial<Member>): Promise<Member> => {
    return apiFetch<Member>(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(member),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/members/${id}`, {
      method: "DELETE",
    });
  },
};
