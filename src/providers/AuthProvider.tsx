"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      // Redirect to overview if on an auth page while logged in
      if (pathname.startsWith("/login") || pathname === "/") {
        router.push("/overview");
      }
    } else {
      // If not on an auth page and no token, redirect to login
      const isAuthPage = 
        pathname.startsWith("/login") || 
        pathname.startsWith("/reset") || 
        pathname.startsWith("/verify") || 
        pathname.startsWith("/new-password");
      
      if (!isAuthPage && pathname !== "/") {
        router.push("/login");
      }
    }
    setLoading(false);
  }, [pathname, router]);

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    router.push("/overview");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
