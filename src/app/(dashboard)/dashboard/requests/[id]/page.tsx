"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRequest } from "@/hooks/requests.hook";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { PaymentButton } from "@/components/modules/payment-button";
import { StatusModal } from "@/components/modules/status-modal";
import { FeedbackModal } from "@/components/modules/feedback-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Wrench,
  Receipt,
  Star,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function CustomerRequestDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: requestData, isLoading, refetch } = useRequest(id);
  const request = requestData?.data;

  const [statusOpen, setStatusOpen] = React.useState(false);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-muted/60 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-xl bg-muted/60 animate-pulse" />
          <div className="h-80 rounded-xl bg-muted/60 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="size-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Service Order Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const canCancel =
    request.status !== "COMPLETED" &&
    request.status !== "CANCELLED" &&
    request.status !== "IN_PROGRESS";

  const isCompleted = request.status === "COMPLETED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
            <Link href="/dashboard">
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

        <div className="flex items-center gap-2">
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => setStatusOpen(true)}
            >
              Cancel Request
            </Button>
          )}

          {isCompleted && !request.review && (
            <Button
              size="sm"
              variant="secondary"
              className="gap-1.5"
              onClick={() => setFeedbackOpen(true)}
            >
              <Star className="size-4 text-amber-500 fill-amber-500" />
              <span>Rate Service</span>
            </Button>
          )}

          {request.invoice && request.invoice.status !== "PAID" && (
            <PaymentButton invoice={request.invoice} size="sm" />
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Status Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{request.title}</CardTitle>
              <CardDescription>
                Service Category: {request.service?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Reported Issue
                </h4>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed">
                  {request.description}
                </p>
              </div>

              {/* Service Report if completed */}
              {request.serviceReport && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="size-4" />
                    <span>Technician Work Report & Resolution</span>
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
                    <span className="font-semibold text-foreground">Preferred Date</span>
                    <p className="text-muted-foreground mt-0.5">
                      {formatDateTime(request.preferredDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>Service Progress Timeline</span>
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
                  <p className="text-xs text-muted-foreground">No updates logged yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Technician, Invoice, Feedback */}
        <div className="space-y-6">
          {/* Assigned Technician */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                <span>Assigned Specialist</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {request.technician?.user ? (
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {request.technician.user.name}
                  </p>
                  <p className="text-muted-foreground">
                    Skills: {request.technician.skills.join(", ")}
                  </p>
                  <p className="text-muted-foreground">
                    Rating: {request.technician.rating} ★ ({request.technician.experienceYears} yrs exp)
                  </p>
                  {request.scheduledDate && (
                    <div className="mt-2 rounded-lg bg-muted/40 p-2.5 border border-border/50 text-[11px]">
                      <strong>Arrival Window:</strong>
                      <p>{formatDateTime(request.scheduledDate)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  An operations manager is matching the best certified technician for your area.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Invoice Box */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Receipt className="size-4 text-primary" />
                <span>Invoice & Payment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              {request.invoice ? (
                <div className="space-y-3">
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

                  <div className="flex items-baseline justify-between border-t border-border/50 pt-2">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-base font-extrabold text-foreground">
                      {formatCurrency(request.invoice.totalAmount)}
                    </span>
                  </div>

                  {request.invoice.status !== "PAID" && (
                    <PaymentButton invoice={request.invoice} className="w-full" />
                  )}
                </div>
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  <p className="font-bold text-foreground">
                    Est: {formatCurrency(request.finalPrice || request.estimatedPrice || request.service?.basePrice)}
                  </p>
                  <p className="text-[11px] mt-1">Official invoice issued upon work completion.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Card */}
          {request.review && (
            <Card className="border-amber-200 bg-amber-50/20 dark:border-amber-900/60 dark:bg-amber-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span>Your Feedback ({request.review.rating}/5)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-foreground italic">
                &ldquo;{request.review.comment}&rdquo;
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <StatusModal
        request={request}
        targetStatus="CANCELLED"
        open={statusOpen}
        onOpenChange={setStatusOpen}
        onSuccess={refetch}
      />

      <FeedbackModal
        request={request}
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
