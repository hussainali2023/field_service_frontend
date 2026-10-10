"use client";

import * as React from "react";
import Link from "next/link";
import { useMyRequests } from "@/hooks/requests.hook";
import { useAuth } from "@/providers/auth.provider";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { PaymentButton } from "@/components/modules/payment-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { ServiceRequest } from "@/types";
import {
  Plus,
  Wrench,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Receipt,
  Sparkles,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { data: myRequestsData, isLoading } = useMyRequests();

  const rawData = myRequestsData?.data as any;
  const requests: ServiceRequest[] = rawData?.requests || (Array.isArray(rawData) ? rawData : []);

  const activeRequests = requests.filter(
    (r) => r.status !== "COMPLETED" && r.status !== "CANCELLED"
  );
  const completedRequests = requests.filter((r) => r.status === "COMPLETED");

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-card to-card p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-foreground">
              Hello, {user?.name || "Customer"} 👋
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track ongoing technician dispatches, schedule visits, and view settled Stripe receipts.
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 shadow-sm self-start sm:self-auto">
          <Link href="/dashboard/requests/new">
            <Plus className="size-4" />
            <span>Request a Service</span>
          </Link>
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Orders
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {activeRequests.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Under review or dispatched
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completed Jobs
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {completedRequests.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Service reports filed
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Requests
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Wrench className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {requests.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Lifetime orders placed
          </p>
        </Card>
      </div>

      {/* Active Service Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Active Work Orders & Upcoming Visits
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : activeRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRequests.map((req) => (
              <Card key={req.id} className="border-border/90 hover:border-primary/40 transition-all shadow-xs">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">
                      {req.requestNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={req.status} />
                      <UrgencyBadge urgency={req.urgency} />
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">
                    {req.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Service: {req.service?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {req.description}
                  </p>

                  <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/50 space-y-1">
                    {req.technician?.user ? (
                      <p>
                        <strong className="text-foreground">Assigned Technician:</strong>{" "}
                        {req.technician.user.name} ({req.technician.rating} ★)
                      </p>
                    ) : (
                      <p className="italic">Technician matching in progress...</p>
                    )}
                    <p>
                      <strong className="text-foreground">Preferred Slot:</strong>{" "}
                      {formatDateTime(req.preferredDate)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-foreground">
                      Est: {formatCurrency(req.finalPrice || req.estimatedPrice || req.service?.basePrice)}
                    </span>
                    <Button asChild size="sm" variant="outline" className="text-xs gap-1 h-8">
                      <Link href={`/dashboard/requests/${req.id}`}>
                        <span>View Status Timeline</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-3 border-dashed">
            <Wrench className="size-8 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-bold text-foreground">No active service requests</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Everything is running smoothly! Need an AC check, plumbing fix, or electrical upgrade?
            </p>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/requests/new">
                <Plus className="size-4" />
                <span>Book a Service</span>
              </Link>
            </Button>
          </Card>
        )}
      </div>

      {/* Service Request History Table */}
      <Card>
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-base">All Service History</CardTitle>
          <CardDescription>
            Complete chronological record of all service requests placed with FieldPulse.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Preferred Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Invoice / Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="py-4">
                      <div className="h-6 w-full rounded-md bg-muted/60 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {req.requestNumber}
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-xs text-foreground">{req.title}</p>
                      <p className="text-[11px] text-muted-foreground">{req.service?.name}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(req.preferredDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="font-bold text-xs text-foreground">
                      {formatCurrency(req.finalPrice || req.estimatedPrice || req.service?.basePrice)}
                    </TableCell>
                    <TableCell>
                      {req.invoice ? (
                        <div className="flex items-center gap-2">
                          <PaymentButton invoice={req.invoice} size="sm" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Pending completion
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                        <Link href={`/dashboard/requests/${req.id}`}>
                          Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No requests found. Click &ldquo;Request a Service&rdquo; above.
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
