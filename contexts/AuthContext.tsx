"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthSuccess, getMe, PublicUser } from "@/utils/api/public";

type AuthContextValue = {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
  setAuthFromLogin: (data: { token: string; user?: PublicUser | null; expiresIn?: string }) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistToken = (value: string | null) => {
    if (typeof window === "undefined") return;
    if (value) {
      localStorage.setItem("public_user_token", value);
    } else {
      localStorage.removeItem("public_user_token");
    }
  };

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getMe(token);
      const incomingUser = (res as any)?.data?.user ?? (res as any)?.data;
      if (res.status === "error" || !incomingUser) {
        setUser(null);
      } else {
        setUser(incomingUser as PublicUser);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("public_user_token") : null;
    if (stored) {
      setToken(stored);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token, refreshUser]);

  const setAuthFromLogin = (data: { token: string; user?: PublicUser | null; expiresIn?: string }) => {
    if (!data?.token) return;
    setToken(data.token);
    persistToken(data.token);
    setUser(data.user ?? user);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    persistToken(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    setAuthFromLogin,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

