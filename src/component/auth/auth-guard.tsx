"use client";

import { useAuth } from "@/providers/auth.provider";
import { useRouter } from "next/navigation";
import * as React from "react";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <AuthLoading label="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  return <>{children}</>;
}
