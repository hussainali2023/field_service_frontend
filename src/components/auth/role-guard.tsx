"use client";

import { useAuth } from "@/providers/auth.provider";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import * as React from "react";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const { user, role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const isAuthorized = role ? roles.includes(role) : false;

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <AuthLoading label="Verifying permissions..." />;
  }

  if (!isAuthenticated || !user) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  if (!isAuthorized) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
