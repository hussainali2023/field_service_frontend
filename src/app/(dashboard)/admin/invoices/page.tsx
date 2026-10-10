"use client";

import * as React from "react";
import Link from "next/link";
import { useInvoices, useCancelInvoice } from "@/hooks/invoices.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, getInvoiceStatusConfig } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { Invoice, InvoiceStatus } from "@/types";
import { Receipt, Ban, CreditCard } from "lucide-react";

export default function AdminInvoicesPage() {
  const [statusFilter, setStatusFilter] = React.useState<InvoiceStatus | "ALL">("ALL");

  const { data: invoicesData, isLoading, refetch } = useInvoices({
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });
  const { mutate: cancelInvoice } = useCancelInvoice();

  const invoices: Invoice[] = invoicesData?.data || [];

  const handleCancel = (inv: Invoice) => {
    if (confirm(`Are you sure you want to cancel invoice #${inv.invoiceNumber}?`)) {
      cancelInvoice(inv.id, {
        onSuccess: () => {
          toast.success(`Invoice #${inv.invoiceNumber} cancelled`);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to cancel invoice");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Invoices & Payment Operations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor client billing, Stripe settlement records, tax breakdown, and due dates.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | "ALL")}
          className="flex h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="ALL">All Payment States</option>
          <option value="UNPAID">UNPAID</option>
          <option value="PAID">PAID</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Service Request</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9} className="py-4">
                      <div className="h-6 w-full rounded-md bg-muted/60 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : invoices.length > 0 ? (
                invoices.map((inv) => {
                  const badgeCfg = getInvoiceStatusConfig(inv.status);
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs font-bold text-primary">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <Link
                            href={`/admin/requests/${inv.serviceRequestId}`}
                            className="font-semibold text-xs text-foreground hover:underline"
                          >
                            {inv.serviceRequest?.title || "View Request"}
                          </Link>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {inv.serviceRequest?.requestNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {inv.serviceRequest?.customer?.name || "Customer"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatCurrency(inv.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatCurrency(inv.tax)}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">
                        {formatCurrency(inv.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeCfg.className}`}
                        >
                          {badgeCfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(inv.dueDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.status === "UNPAID" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => handleCancel(inv)}
                          >
                            <Ban className="size-3.5 mr-1" />
                            <span>Cancel</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-xs text-muted-foreground">
                    No invoices matching filter.
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
