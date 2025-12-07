import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../api/axios";
import { User } from "../Models/User";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<number> => {
    let response: number = 0;

    try {
      const axiosResponse = await api.post("/api/Auth/login", {
        email,
        password,
      });
      response = axiosResponse.status;

      if (response == 200) {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }

    return response;
  };

  const logout = async () => {
    const response = await api.post("/api/auth/logout");
    setUser(null);
    return response.status;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
