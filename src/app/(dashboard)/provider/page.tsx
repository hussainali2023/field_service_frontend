"use client";

import * as React from "react";
import Link from "next/link";
import { useMyAssignments, useUpdateStatus } from "@/hooks/requests.hook";
import { useAuth } from "@/providers/auth.provider";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UrgencyBadge } from "@/components/dashboard/urgency-badge";
import { ReportModal } from "@/components/modules/report-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { ServiceRequest, RequestStatus } from "@/types";
import {
  Wrench,
  Navigation,
  Play,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  ArrowRight,
  Clock,
  Briefcase,
} from "lucide-react";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { data: assignmentsData, isLoading, refetch } = useMyAssignments();
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateStatus();

  const rawData = assignmentsData?.data as any;
  const jobs: ServiceRequest[] = rawData?.requests || (Array.isArray(rawData) ? rawData : []);

  const [selectedJob, setSelectedJob] = React.useState<ServiceRequest | null>(null);
  const [reportOpen, setReportOpen] = React.useState(false);

  const activeJobs = jobs.filter((j) => j.status !== "COMPLETED" && j.status !== "CANCELLED");
  const completedJobs = jobs.filter((j) => j.status === "COMPLETED");

  const handleAdvanceStatus = (job: ServiceRequest, nextStatus: RequestStatus) => {
    updateStatus(
      { id: job.id, payload: { status: nextStatus } },
      {
        onSuccess: () => {
          toast.success(`Job status updated to ${nextStatus}`);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update job status");
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Field Technician Workspace
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Welcome, {user?.name || "Technician"}. Manage dispatched work orders, update arrival status, and file completion reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/provider/profile">
              <span>My Skills & Rate</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Assigned Queue
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {activeJobs.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Pending visit or work execution
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Completed Orders
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">
            {completedJobs.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Work completed & reports filed
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hourly Billing Rate
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            ${user?.technicianProfile?.hourlyRate || 65}/hr
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Rating: {user?.technicianProfile?.rating || 4.9} ★
          </p>
        </Card>
      </div>

      {/* Assigned Queue Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Priority Work Orders
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-56 rounded-xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : activeJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map((job) => (
              <Card key={job.id} className="border-border shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">
                      {job.requestNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={job.status} />
                      <UrgencyBadge urgency={job.urgency} />
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Service: {job.service?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>

                  <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1.5 border border-border/50">
                    <div className="flex items-start gap-2">
                      <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{job.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-primary shrink-0" />
                      <span>Scheduled: {formatDateTime(job.scheduledDate || job.preferredDate)}</span>
                    </div>
                    {job.customer && (
                      <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                        <span className="font-semibold text-foreground">
                          {job.customer.name}
                        </span>
                        {job.customer.phone && (
                          <span className="text-primary font-mono text-[11px]">
                            {job.customer.phone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Operational Status Action Buttons */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-3 gap-2">
                    <Button asChild size="sm" variant="outline" className="text-xs h-8">
                      <Link href={`/provider/jobs/${job.id}`}>
                        View Instructions
                      </Link>
                    </Button>

                    {job.status === "SCHEDULED" || job.status === "ASSIGNED" ? (
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white"
                        isLoading={updatingStatus}
                        onClick={() => handleAdvanceStatus(job, "ON_THE_WAY")}
                      >
                        <Navigation className="size-3.5" />
                        <span>I&apos;m On The Way</span>
                      </Button>
                    ) : job.status === "ON_THE_WAY" ? (
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs h-8 bg-yellow-600 hover:bg-yellow-700 text-white"
                        isLoading={updatingStatus}
                        onClick={() => handleAdvanceStatus(job, "IN_PROGRESS")}
                      >
                        <Play className="size-3.5" />
                        <span>Arrived & Start Work</span>
                      </Button>
                    ) : job.status === "IN_PROGRESS" ? (
                      <Button
                        size="sm"
                        variant="success"
                        className="gap-1.5 text-xs h-8"
                        onClick={() => {
                          setSelectedJob(job);
                          setReportOpen(true);
                        }}
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Complete & File Report</span>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-2 border-dashed">
            <Briefcase className="size-8 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-bold text-foreground">No pending assigned jobs</h3>
            <p className="text-xs text-muted-foreground">
              Your dispatch queue is all caught up. New assignments will appear here automatically.
            </p>
          </Card>
        )}
      </div>

      <ReportModal
        request={selectedJob}
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
