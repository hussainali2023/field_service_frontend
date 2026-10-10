"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  UserRole,
  GoogleLoginPayload,
} from "@/types";
import {
  loginApi,
  googleLoginApi,
  getMeApi,
} from "@/api/auth.api";
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
} from "@/lib/auth-storage";
import { toast } from "@/components/ui/toast";

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  googleLogin: (payload: GoogleLoginPayload) => Promise<User>;
  demoLogin: (role: UserRole) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const refreshUser = React.useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      return;
    }
    try {
      const res = await getMeApi();
      if (res?.data) {
        setUser(res.data);
        setStoredUser(res.data);
      }
    } catch {
      removeStoredToken();
      setUser(null);
      setToken(null);
    }
  }, []);

  React.useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsLoading(false);
      refreshUser().catch(() => {});
    } else if (storedToken) {
      setToken(storedToken);
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await loginApi({ email, password });
      const { user: loggedInUser, accessToken } = res.data;
      setStoredToken(accessToken);
      setStoredUser(loggedInUser);
      setToken(accessToken);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}`);
      return loggedInUser;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (payload: GoogleLoginPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await googleLoginApi(payload);
      const { user: loggedInUser, accessToken } = res.data;
      setStoredToken(accessToken);
      setStoredUser(loggedInUser);
      setToken(accessToken);
      setUser(loggedInUser);
      toast.success(`Signed in as ${loggedInUser.name}`);
      return loggedInUser;
    } catch (error: any) {
      toast.error(error.message || "Google sign in failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (targetRole: UserRole): Promise<User> => {
    if (targetRole === "ADMIN") {
      return await login("admin@fieldservice.com", "Admin@12345");
    } else if (targetRole === "TECHNICIAN") {
      return await login("technician@fieldservice.com", "Tech@12345");
    } else {
      try {
        return await login("customer@fieldservice.com", "Customer@12345");
      } catch {
        return await googleLogin({
          email: "googleuser@fieldservice.com",
          name: "Google Verified Customer",
        });
      }
    }
  };

  const logout = React.useCallback(() => {
    removeStoredToken();
    setUser(null);
    setToken(null);
    queryClient.clear();
    toast.info("Signed out successfully");
    router.push("/login");
  }, [queryClient, router]);

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    googleLogin,
    demoLogin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
