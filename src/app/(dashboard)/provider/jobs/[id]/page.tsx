"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequest, useUpdateStatus } from "@/hooks/requests.hook";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { ReportModal } from "@/components/modules/report-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { RequestStatus } from "@/types";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Wrench,
  Navigation,
  Play,
  CheckCircle2,
  Phone,
  User,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export default function TechnicianJobDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: requestData, isLoading, refetch } = useRequest(id);
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateStatus();
  const request = requestData?.data;

  const [reportOpen, setReportOpen] = React.useState(false);

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
        <h2 className="text-xl font-bold">Work Order Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/provider">Back to Job Queue</Link>
        </Button>
      </div>
    );
  }

  const handleAdvanceStatus = (nextStatus: RequestStatus) => {
    updateStatus(
      { id: request.id, payload: { status: nextStatus } },
      {
        onSuccess: () => {
          toast.success(`Job transitioned to ${nextStatus}`);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update status");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
            <Link href="/provider">
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

        {/* Status Transition Action Buttons */}
        <div className="flex items-center gap-2">
          {request.status === "SCHEDULED" || request.status === "ASSIGNED" ? (
            <Button
              size="sm"
              className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
              isLoading={updatingStatus}
              onClick={() => handleAdvanceStatus("ON_THE_WAY")}
            >
              <Navigation className="size-3.5" />
              <span>Depart & Mark On The Way</span>
            </Button>
          ) : request.status === "ON_THE_WAY" ? (
            <Button
              size="sm"
              className="gap-1.5 bg-yellow-600 hover:bg-yellow-700 text-white"
              isLoading={updatingStatus}
              onClick={() => handleAdvanceStatus("IN_PROGRESS")}
            >
              <Play className="size-3.5" />
              <span>Record Arrival & Start Work</span>
            </Button>
          ) : request.status === "IN_PROGRESS" ? (
            <Button
              size="sm"
              variant="success"
              className="gap-1.5"
              onClick={() => setReportOpen(true)}
            >
              <CheckCircle2 className="size-3.5" />
              <span>Complete Job & File Report</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Instructions, Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{request.title}</CardTitle>
              <CardDescription>
                Service Category: {request.service?.name} ({request.service?.category})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Customer Reported Symptoms
                </h4>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed">
                  {request.description}
                </p>
              </div>

              {request.adminNotes && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Dispatcher Notes & Special Equipment
                  </h4>
                  <p className="text-sm text-foreground bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-200/50 leading-relaxed">
                    {request.adminNotes}
                  </p>
                </div>
              )}

              {/* Service Report If Filed */}
              {request.serviceReport && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="size-4" />
                    <span>Filed Service Report</span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {request.serviceReport}
                  </p>
                  {request.partsUsed && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Parts Used:</strong> {request.partsUsed}
                    </p>
                  )}
                  <p className="text-xs font-bold text-foreground">
                    Final Billed Price: {formatCurrency(request.finalPrice)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/60 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">On-Site Address</span>
                    <p className="text-muted-foreground mt-0.5">{request.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Scheduled Slot</span>
                    <p className="text-muted-foreground mt-0.5">
                      {formatDateTime(request.scheduledDate || request.preferredDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Audit */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>Job Progress History</span>
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
                  <p className="text-xs text-muted-foreground">No events recorded.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Info & Quick Action */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span>Customer Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              <div>
                <p className="font-bold text-sm text-foreground">{request.customer?.name}</p>
                <p className="text-muted-foreground">{request.customer?.email}</p>
                {request.customer?.phone && (
                  <p className="text-primary font-mono mt-1 flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    <span>{request.customer.phone}</span>
                  </p>
                )}
              </div>

              <div className="border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                <p>Call customer 15 minutes before arrival to confirm access.</p>
              </div>
            </CardContent>
          </Card>

          {/* Report Filing Card */}
          {request.status === "IN_PROGRESS" && (
            <Card className="border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <FileCheck className="size-4" />
                  <span>Work Done?</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Submit service report and parts used to finalize invoice and close work order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="success"
                  className="w-full text-xs"
                  onClick={() => setReportOpen(true)}
                >
                  File Completion Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ReportModal
        request={request}
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
