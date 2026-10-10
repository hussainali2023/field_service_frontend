"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardStatsResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PieChart, BarChart3, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";

export function AdminCharts({ stats }: { stats: DashboardStatsResponse }) {
  const { overview, requestsByStatus } = stats;

  const statusEntries = [
    { label: "Completed", key: "COMPLETED", color: "bg-emerald-500", textColor: "text-emerald-600", barColor: "#10b981" },
    { label: "In Progress", key: "IN_PROGRESS", color: "bg-yellow-500", textColor: "text-yellow-600", barColor: "#eab308" },
    { label: "Scheduled", key: "SCHEDULED", color: "bg-cyan-500", textColor: "text-cyan-600", barColor: "#06b6d4" },
    { label: "On The Way", key: "ON_THE_WAY", color: "bg-amber-500", textColor: "text-amber-600", barColor: "#f59e0b" },
    { label: "Assigned", key: "ASSIGNED", color: "bg-purple-500", textColor: "text-purple-600", barColor: "#a855f7" },
    { label: "Reviewed", key: "REVIEWED", color: "bg-indigo-500", textColor: "text-indigo-600", barColor: "#6366f1" },
    { label: "Requested", key: "REQUESTED", color: "bg-blue-500", textColor: "text-blue-600", barColor: "#3b82f6" },
    { label: "Cancelled", key: "CANCELLED", color: "bg-rose-500", textColor: "text-rose-600", barColor: "#f43f5e" },
  ];

  const total = overview.totalRequests || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Breakdown Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Order Status Distribution</CardTitle>
              <CardDescription>
                Live request volume across workflow lifecycle stages
              </CardDescription>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="size-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2.5">
            {statusEntries.map((item) => {
              const count = requestsByStatus[item.key] || 0;
              const percent = Math.round((count / total) * 100);
              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${item.color}`} />
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial & Operations Efficiency Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial & Settlement Summary</CardTitle>
              <CardDescription>
                Aggregated revenue collection and pending billing receivables
              </CardDescription>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <TrendingUp className="size-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Stripe Settled
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {formatCurrency(overview.totalRevenue)}
              </p>
              <p className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                {overview.totalCompletedPayments} transactions confirmed
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Pending Unpaid
              </span>
              <p className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">
                {formatCurrency(overview.unpaidInvoicesTotal)}
              </p>
              <p className="mt-1 text-[11px] text-amber-600/80 dark:text-amber-400/80">
                {overview.unpaidInvoicesCount} invoices due
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Workforce Capacity Overview
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-card p-2.5 border border-border/50">
                <span className="text-lg font-bold text-foreground">
                  {overview.techniciansCount}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Technicians</p>
              </div>
              <div className="rounded-lg bg-card p-2.5 border border-border/50">
                <span className="text-lg font-bold text-foreground">
                  {overview.customersCount}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Customers</p>
              </div>
              <div className="rounded-lg bg-card p-2.5 border border-border/50">
                <span className="text-lg font-bold text-foreground">
                  {overview.adminsCount}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Admins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
