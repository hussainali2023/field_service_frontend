"use client";

import * as React from "react";
import Link from "next/link";
import { useMyInvoices } from "@/hooks/invoices.hook";
import { PaymentButton } from "@/components/modules/payment-button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, getInvoiceStatusConfig } from "@/lib/utils";
import { Invoice } from "@/types";
import { Receipt, CreditCard, ShieldCheck } from "lucide-react";

export default function CustomerInvoicesPage() {
  const { data: invoicesData, isLoading } = useMyInvoices();
  const invoices: Invoice[] = invoicesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Billing & Invoices
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review itemized invoices, due balances, and complete payments via Stripe.
        </p>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Service Order</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax & Fees</TableHead>
                <TableHead>Total Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Payment Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8} className="py-4">
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
                            href={`/dashboard/requests/${inv.serviceRequestId}`}
                            className="font-semibold text-xs text-foreground hover:underline"
                          >
                            {inv.serviceRequest?.title || "View Request"}
                          </Link>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {inv.serviceRequest?.requestNumber}
                          </p>
                        </div>
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
                        <PaymentButton invoice={inv} size="sm" />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-xs text-muted-foreground">
                    No billing records yet. Completed orders will generate invoices automatically.
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
