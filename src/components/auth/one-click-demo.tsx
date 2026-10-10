"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth.provider";
import { ShieldCheck, User as UserIcon, Wrench, Sparkles, ArrowRight } from "lucide-react";
import { UserRole } from "@/types";

export default function OneClickDemoLogin() {
  const { demoLogin, isLoading } = useAuth();
  const [activeRole, setActiveRole] = React.useState<UserRole | null>(null);

  const handleDemo = async (role: UserRole) => {
    setActiveRole(role);
    try {
      await demoLogin(role);
    } finally {
      setActiveRole(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-muted/40 p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick 1-Click Role Login
          </span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border/60">
          Demo Sandboxes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Admin Demo Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleDemo("ADMIN")}
          className="group relative flex flex-col items-start gap-1.5 rounded-xl border border-border/70 bg-card p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs active:scale-[0.98] disabled:opacity-50"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <ShieldCheck className="size-4" />
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">Admin</span>
            <span className="block text-[11px] text-muted-foreground">Full system & ops</span>
          </div>
        </button>

        {/* Customer Demo Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleDemo("CUSTOMER")}
          className="group relative flex flex-col items-start gap-1.5 rounded-xl border border-border/70 bg-card p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs active:scale-[0.98] disabled:opacity-50"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <UserIcon className="size-4" />
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">Customer</span>
            <span className="block text-[11px] text-muted-foreground">Bookings & Pay</span>
          </div>
        </button>

        {/* Technician Demo Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleDemo("TECHNICIAN")}
          className="group relative flex flex-col items-start gap-1.5 rounded-xl border border-border/70 bg-card p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs active:scale-[0.98] disabled:opacity-50"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Wrench className="size-4" />
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">Provider</span>
            <span className="block text-[11px] text-muted-foreground">Jobs & Reports</span>
          </div>
        </button>
      </div>

      <div className="text-[11px] text-muted-foreground/80 flex items-center justify-between px-1">
        <span>Pre-configured with test data</span>
        <span className="font-mono text-[10px]">Stripe Ready</span>
      </div>
    </div>
  );
}
