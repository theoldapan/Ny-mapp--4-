import { createContext } from "react";

export interface AuthContextType {
  user: any | null;
  login: (username: string, password: string) => Promise<number>;
  logout: () => Promise<number>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => 0,
  logout: async () => 0,
});
