"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";
import { UserRole, SidebarItems } from "@/types";
import { adminRoutes, customerRoutes, providerRoutes } from "@/routes";
import { cn } from "@/lib/utils";
import {
  Wrench,
  LogOut,
  ChevronRight,
  Shield,
  UserCheck,
  HardHat,
} from "lucide-react";

const roleRoutesMap: Record<UserRole, SidebarItems> = {
  ADMIN: adminRoutes,
  CUSTOMER: customerRoutes,
  TECHNICIAN: providerRoutes,
};

const roleInfoMap: Record<
  UserRole,
  { label: string; badgeClass: string; icon: any }
> = {
  ADMIN: {
    label: "Admin Portal",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300",
    icon: Shield,
  },
  CUSTOMER: {
    label: "Customer Portal",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300",
    icon: UserCheck,
  },
  TECHNICIAN: {
    label: "Provider Desk",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300",
    icon: HardHat,
  },
};

export function DashboardSidebar({
  role,
  onNavigate,
}: {
  role: UserRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const routes = roleRoutesMap[role] || [];
  const roleMeta = roleInfoMap[role] || roleInfoMap.CUSTOMER;
  const RoleIcon = roleMeta.icon;

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-border bg-card">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-6">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Wrench className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold leading-none tracking-tight">
                FieldPulse
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Portal Role Badge */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-2">
              <RoleIcon className="size-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                {roleMeta.label}
              </span>
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleMeta.badgeClass}`}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
          {routes.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group.title}
              </h4>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.url === "/admin" ||
                    item.url === "/dashboard" ||
                    item.url === "/provider"
                      ? pathname === item.url
                      : pathname === item.url || pathname.startsWith(`${item.url}/`);

                  return (
                    <Link
                      key={item.url}
                      href={item.url}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {Icon && (
                          <Icon
                            className={cn(
                              "size-4 shrink-0 transition-colors",
                              isActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                        )}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer Card */}
      <div className="border-t border-border/80 p-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="size-8 shrink-0 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                {user?.name?.[0] || "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {user?.name || "Logged In User"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
