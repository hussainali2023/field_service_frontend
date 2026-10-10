"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAllRequests } from "@/hooks/requests.hook";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { AssignModal } from "@/components/modules/assign-modal";
import { ReviewModal } from "@/components/modules/review-modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RequestStatus, UrgencyLevel, ServiceRequest } from "@/types";
import { Search, Filter, Wrench, UserCheck, Calendar } from "lucide-react";

export default function AdminRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlStatus = (searchParams.get("status") as RequestStatus) || undefined;
  const urlUrgency = (searchParams.get("urgency") as UrgencyLevel) || undefined;
  const urlSearch = searchParams.get("q") || "";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchTerm, setSearchTerm] = React.useState(urlSearch);
  const [selectedStatus, setSelectedStatus] = React.useState<RequestStatus | "ALL">(urlStatus || "ALL");
  const [selectedUrgency, setSelectedUrgency] = React.useState<UrgencyLevel | "ALL">(urlUrgency || "ALL");

  // Selected request for modals
  const [selectedRequest, setSelectedRequest] = React.useState<ServiceRequest | null>(null);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);

  // Sync state to URL
  const updateUrl = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === "ALL") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    router.push(`/admin/requests?${params.toString()}`);
  };

  const { data: responseData, isLoading, refetch } = useAllRequests({
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
    urgency: selectedUrgency === "ALL" ? undefined : selectedUrgency,
    searchTerm: searchTerm || undefined,
    page: urlPage,
    limit: 10,
  });

  const rawData = responseData?.data as any;
  const requests: ServiceRequest[] = rawData?.requests || (Array.isArray(rawData) ? rawData : []);
  const meta = rawData?.meta || { page: 1, totalPages: 1, total: requests.length };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: searchTerm, page: "1" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Service Request Dispatch Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Triage, review pricing, and assign certified technicians across all regions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by order #, title, customer, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  const val = e.target.value as RequestStatus | "ALL";
                  setSelectedStatus(val);
                  updateUrl({ status: val, page: "1" });
                }}
                className="flex h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Statuses</option>
                <option value="REQUESTED">REQUESTED</option>
                <option value="REVIEWED">REVIEWED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="ON_THE_WAY">ON_THE_WAY</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              {/* Urgency Filter */}
              <select
                value={selectedUrgency}
                onChange={(e) => {
                  const val = e.target.value as UrgencyLevel | "ALL";
                  setSelectedUrgency(val);
                  updateUrl({ urgency: val, page: "1" });
                }}
                className="flex h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Urgencies</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="EMERGENCY">EMERGENCY</option>
              </select>

              <Button type="submit" size="sm" variant="secondary" className="text-xs">
                Filter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Service & Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Price</TableHead>
                <TableHead className="text-right">Dispatch Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8} className="py-4">
                      <div className="h-6 w-full rounded-md bg-muted/50 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      <Link href={`/admin/requests/${req.id}`} className="hover:underline">
                        {req.requestNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-xs text-foreground">{req.title}</p>
                        <p className="text-[11px] text-muted-foreground">{req.service?.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-medium text-foreground">{req.customer?.name}</p>
                      <p className="text-[11px] text-muted-foreground">{req.customer?.email}</p>
                    </TableCell>
                    <TableCell className="text-xs">
                      {req.technician?.user ? (
                        <span className="font-medium text-foreground">
                          {req.technician.user.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <UrgencyBadge urgency={req.urgency} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="font-bold text-xs">
                      {formatCurrency(req.finalPrice || req.estimatedPrice || req.service?.basePrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === "REQUESTED" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 text-xs"
                            onClick={() => {
                              setSelectedRequest(req);
                              setReviewOpen(true);
                            }}
                          >
                            Review
                          </Button>
                        )}
                        {(req.status === "REQUESTED" || req.status === "REVIEWED") && (
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setSelectedRequest(req);
                              setAssignOpen(true);
                            }}
                          >
                            Assign
                          </Button>
                        )}
                        <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                          <Link href={`/admin/requests/${req.id}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-xs text-muted-foreground">
                    No matching service requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total requests)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => updateUrl({ page: String(meta.page - 1) })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => updateUrl({ page: String(meta.page + 1) })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AssignModal
        request={selectedRequest}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onSuccess={refetch}
      />
      <ReviewModal
        request={selectedRequest}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
