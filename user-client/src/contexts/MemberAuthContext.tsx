import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Member } from "../types";
import { apiFetch } from "../services/api";

interface MemberAuthContextType {
  member: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  city: string;
  postalCode: string;
}

interface LoginResponse {
  member: Member;
  token: string;
}

const MemberAuthContext = createContext<MemberAuthContextType | undefined>(
  undefined
);

const MEMBER_TOKEN_KEY = "halsoprofilen_member_token";
const MEMBER_DATA_KEY = "halsoprofilen_member_data";
const API_BASE_URL = "https://localhost:7015/api";

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(MEMBER_TOKEN_KEY);
    const memberData = localStorage.getItem(MEMBER_DATA_KEY);

    if (token && memberData) {
      try {
        setMember(JSON.parse(memberData));
      } catch {
        localStorage.removeItem(MEMBER_TOKEN_KEY);
        localStorage.removeItem(MEMBER_DATA_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/members/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || "Invalid email or password");
    }

    const data: LoginResponse = await response.json();

    localStorage.setItem(MEMBER_TOKEN_KEY, data.token);
    localStorage.setItem(MEMBER_DATA_KEY, JSON.stringify(data.member));
    setMember(data.member);
  };

  const register = async (registerData: RegisterData) => {
    const response = await fetch(`${API_BASE_URL}/members/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Email: registerData.email,
        Password: registerData.password,
        FirstName: registerData.firstName,
        LastName: registerData.lastName,
        Phone: registerData.phone,
        DateOfBirth: registerData.dateOfBirth,
        Gender: registerData.gender,
        Address: registerData.address,
        City: registerData.city,
        PostalCode: registerData.postalCode,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Registration failed" }));
      throw new Error(error.message || "Could not create account");
    }

    const data: LoginResponse = await response.json();

    localStorage.setItem(MEMBER_TOKEN_KEY, data.token);
    localStorage.setItem(MEMBER_DATA_KEY, JSON.stringify(data.member));
    setMember(data.member);
  };

  const logout = () => {
    localStorage.removeItem(MEMBER_TOKEN_KEY);
    localStorage.removeItem(MEMBER_DATA_KEY);
    setMember(null);
  };

  return (
    <MemberAuthContext.Provider
      value={{
        member,
        isAuthenticated: !!member,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);
  if (context === undefined) {
    throw new Error("useMemberAuth must be used within a MemberAuthProvider");
  }
  return context;
}
