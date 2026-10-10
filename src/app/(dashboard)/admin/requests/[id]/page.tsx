"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequest } from "@/hooks/requests.hook";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { AssignModal } from "@/components/modules/assign-modal";
import { ReviewModal } from "@/components/modules/review-modal";
import { InvoiceModal } from "@/components/modules/invoice-modal";
import { StatusModal } from "@/components/modules/status-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { RequestStatus } from "@/types";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Wrench,
  Receipt,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
} from "lucide-react";

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: requestData, isLoading, refetch } = useRequest(id);
  const request = requestData?.data;

  // Modals state
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [invoiceOpen, setInvoiceOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [targetStatus, setTargetStatus] = React.useState<RequestStatus | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-muted/60 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-xl bg-muted/60 animate-pulse" />
          <div className="h-96 rounded-xl bg-muted/60 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="size-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Service Request Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/admin/requests">Back to Requests</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
            <Link href="/admin/requests">
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
                {request.requestNumber}
              </h1>
              <StatusBadge status={request.status} />
              <UrgencyBadge urgency={request.urgency} />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {request.status === "REQUESTED" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setReviewOpen(true)}
            >
              Review Scope
            </Button>
          )}

          {(request.status === "REQUESTED" || request.status === "REVIEWED") && (
            <Button
              size="sm"
              onClick={() => setAssignOpen(true)}
            >
              Assign Technician
            </Button>
          )}

          {request.status !== "COMPLETED" && request.status !== "CANCELLED" && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                setTargetStatus("CANCELLED");
                setStatusOpen(true);
              }}
            >
              Cancel Order
            </Button>
          )}

          {!request.invoice && request.status === "COMPLETED" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => setInvoiceOpen(true)}
            >
              Generate Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Details, Findings, Status Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Request Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{request.title}</CardTitle>
              <CardDescription>
                Category: {request.service?.name} ({request.service?.category})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Customer Problem Description
                </h4>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed">
                  {request.description}
                </p>
              </div>

              {request.adminNotes && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Dispatcher / Reviewer Notes
                  </h4>
                  <p className="text-sm text-foreground bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-200/50 leading-relaxed">
                    {request.adminNotes}
                  </p>
                </div>
              )}

              {/* Work Report If Completed */}
              {request.serviceReport && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="size-4" />
                    <span>Technician Service Findings Report</span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {request.serviceReport}
                  </p>
                  {request.partsUsed && (
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Parts Installed:</strong> {request.partsUsed}
                    </p>
                  )}
                </div>
              )}

              {/* Cancellation Reason If Cancelled */}
              {request.status === "CANCELLED" && request.cancellationReason && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20 p-4">
                  <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                    Cancellation Reason: {request.cancellationReason}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/60 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Service Address</span>
                    <p className="text-muted-foreground mt-0.5">{request.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Preferred Appointment</span>
                    <p className="text-muted-foreground mt-0.5">
                      {formatDateTime(request.preferredDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifecycle Audit Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>Lifecycle Status History Audit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.statusLogs && request.statusLogs.length > 0 ? (
                  request.statusLogs.map((log, idx) => (
                    <div key={log.id} className="relative flex items-start gap-3 pl-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={log.toStatus} />
                          <span className="text-[11px] text-muted-foreground">
                            {formatDateTime(log.createdAt)}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No status transitions recorded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer, Assigned Tech, Invoicing, Feedback */}
        <div className="space-y-6">
          {/* Customer Profile Box */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span>Customer Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="font-bold text-sm text-foreground">{request.customer?.name}</p>
              <p className="text-muted-foreground">{request.customer?.email}</p>
              {request.customer?.phone && (
                <p className="text-muted-foreground">{request.customer.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Assigned Technician Box */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                <span>Assigned Technician</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {request.technician?.user ? (
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {request.technician.user.name}
                  </p>
                  <p className="text-muted-foreground">{request.technician.user.email}</p>
                  <p className="text-muted-foreground mt-1">
                    Skills: {request.technician.skills.join(", ")}
                  </p>
                  <p className="text-muted-foreground">
                    Rate: ${request.technician.hourlyRate}/hr • Rating: {request.technician.rating} ★
                  </p>
                  {request.scheduledDate && (
                    <div className="mt-2 rounded-lg bg-muted/40 p-2 border border-border/50 text-[11px]">
                      <strong>Scheduled Window:</strong>
                      <p>{formatDateTime(request.scheduledDate)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-3 text-center space-y-2">
                  <p className="text-muted-foreground italic">No technician assigned yet.</p>
                  <Button size="sm" onClick={() => setAssignOpen(true)}>
                    Assign Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoicing & Billing Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Receipt className="size-4 text-primary" />
                <span>Invoice & Settlement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              {request.invoice ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">
                      {request.invoice.invoiceNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        request.invoice.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {request.invoice.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between border-t border-border/50 pt-2">
                    <span className="text-muted-foreground">Total Balance:</span>
                    <span className="text-base font-extrabold text-foreground">
                      {formatCurrency(request.invoice.totalAmount)}
                    </span>
                  </div>
                  {request.invoice.payments && request.invoice.payments.length > 0 && (
                    <div className="mt-2 rounded-lg bg-emerald-50/50 p-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                      Payment Confirmed via Stripe Test Mode
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-2 text-center text-muted-foreground">
                  <p>Estimated: {formatCurrency(request.finalPrice || request.estimatedPrice || request.service?.basePrice)}</p>
                  <p className="text-[11px] italic mt-1">Invoice created after service completion.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Review (if available) */}
          {request.review && (
            <Card className="border-amber-200 bg-amber-50/20 dark:border-amber-900/60 dark:bg-amber-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span>Customer Review ({request.review.rating}/5)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-foreground italic">
                &ldquo;{request.review.comment}&rdquo;
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <AssignModal
        request={request}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onSuccess={refetch}
      />
      <ReviewModal
        request={request}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSuccess={refetch}
      />
      <InvoiceModal
        request={request}
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
        onSuccess={refetch}
      />
      <StatusModal
        request={request}
        targetStatus={targetStatus}
        open={statusOpen}
        onOpenChange={setStatusOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
