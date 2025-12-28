"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import customerApi from "../lib/customerApi";

const CustomerAuthContext = createContext(null);

const TOKEN_KEY = "rupantorii_customer_token";
const USER_KEY = "rupantorii_customer";

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (payload) => {
    const response = await customerApi.post("/api/auth/register", payload);
    const { token, user: userData } = response.data;

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }

    setUser(userData);
    return userData;
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await customerApi.post("/api/auth/login", { email, password });
    const { token, user: userData } = response.data;

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }

    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const response = await customerApi.get("/api/auth/me");
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    }
    setUser(response.data);
    return response.data;
  }, []);

  const value = useMemo(
    () => ({ user, register, login, logout, refreshProfile, isAuthenticated: !!user, loading }),
    [user, register, login, logout, refreshProfile, loading]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
}
