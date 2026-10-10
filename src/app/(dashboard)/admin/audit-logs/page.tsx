"use client";

import * as React from "react";
import { useAuditLogs } from "@/hooks/admin.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { History, Shield, Activity } from "lucide-react";

export default function AdminAuditLogsPage() {
  const { data: logsData, isLoading } = useAuditLogs({ limit: 30 });
  const logs = (logsData?.data as any)?.logs || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          System Audit Trail & Compliance
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Immutable chronological ledger of all user registrations, logins, job dispatches, and payments.
        </p>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action Event</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Audit Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="py-4">
                      <div className="h-6 w-full rounded-md bg-muted/60 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length > 0 ? (
                logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-primary">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {log.entity}
                    </TableCell>
                    <TableCell className="text-xs">
                      {log.user?.name || "System"}
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {log.user?.role || "SYSTEM"}
                      </span>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground font-mono max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No audit records logged yet.
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
