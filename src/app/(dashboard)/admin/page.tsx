"use client";

import * as React from "react";
import Link from "next/link";
import { useDashboardStats } from "@/hooks/admin.hook";
import { StatCard } from "@/components/dashboard/stat-card";
import { AdminCharts } from "@/components/modules/admin-charts";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ClipboardList,
  CheckCircle,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Plus,
  Users,
  Wrench,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { data: statsData, isLoading } = useDashboardStats();
  const stats = statsData?.data;

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-muted/60 animate-pulse" />
      </div>
    );
  }

  const { overview, recentRequests } = stats;

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time operational KPIs, technician assignments, and billing oversight.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/admin/technicians">
              <Users className="size-4" />
              <span>Technicians</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href="/admin/requests">
              <ClipboardList className="size-4" />
              <span>Manage Requests</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Service Requests"
          value={overview.totalRequests}
          description={`${overview.inProgressRequests} currently active in field`}
          icon={ClipboardList}
        />
        <StatCard
          title="Completed Jobs"
          value={overview.completedRequests}
          description="Resolved with filed service reports"
          icon={CheckCircle}
          trend={{ value: "+12% this week", positive: true }}
        />
        <StatCard
          title="Stripe Revenue Settled"
          value={formatCurrency(overview.totalRevenue)}
          description={`${overview.totalCompletedPayments} transactions verified`}
          icon={CreditCard}
        />
        <StatCard
          title="Unpaid Billing Due"
          value={formatCurrency(overview.unpaidInvoicesTotal)}
          description={`${overview.unpaidInvoicesCount} invoices pending payment`}
          icon={AlertCircle}
        />
      </div>

      {/* Charts & Analytical Breakdown */}
      <AdminCharts stats={stats} />

      {/* Recent Requests Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-6">
          <div>
            <CardTitle>Recent Service Orders</CardTitle>
            <CardDescription>
              Latest incoming work orders requiring triage or dispatched to technicians.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 self-start sm:self-auto text-xs">
            <Link href="/admin/requests">
              <span>View All Requests</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests && recentRequests.length > 0 ? (
                recentRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {req.requestNumber}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {req.service?.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {req.customer?.name}
                    </TableCell>
                    <TableCell>
                      <UrgencyBadge urgency={req.urgency} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(req.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" className="text-xs h-7">
                        <Link href={`/admin/requests/${req.id}`}>
                          Inspect
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                    No recent service requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
