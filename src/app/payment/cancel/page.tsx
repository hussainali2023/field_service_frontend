"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Receipt, ShieldAlert } from "lucide-react";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoice_id") || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <Card className="max-w-md w-full border-border shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 mx-auto">
            <XCircle className="size-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Payment Cancelled
            </h1>
            <p className="text-xs text-muted-foreground">
              You exited the Stripe Checkout process without completing the payment. Your invoice remains unpaid and open for retry.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground text-left space-y-1">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldAlert className="size-4 text-amber-500" />
              <span>No funds were deducted</span>
            </div>
            <p className="text-[11px]">
              You can return to your invoice at any time to resume checkout when you are ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <Button asChild className="gap-2">
              <Link href="/dashboard/invoices">
                <Receipt className="size-4" />
                <span>Return to Invoices</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
