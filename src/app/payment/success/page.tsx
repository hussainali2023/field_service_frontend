"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyPayment } from "@/hooks/payments.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Receipt } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const invoiceId = searchParams.get("invoice_id") || "";

  const { mutate: verifyPayment, isPending, data: verifyData, isError, error } = useVerifyPayment();
  const [hasTriggered, setHasTriggered] = React.useState(false);

  React.useEffect(() => {
    if (sessionId && !hasTriggered) {
      setHasTriggered(true);
      verifyPayment({ sessionId, invoiceId: invoiceId || undefined });
    }
  }, [sessionId, invoiceId, hasTriggered, verifyPayment]);

  const handleRetry = () => {
    if (sessionId) {
      verifyPayment({ sessionId, invoiceId: invoiceId || undefined });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <Card className="max-w-md w-full border-border shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* While Verifying */}
          {isPending && (
            <div className="py-8 space-y-4">
              <Spinner className="size-12 text-primary mx-auto" />
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">
                  Verifying Stripe Settlement...
                </h2>
                <p className="text-xs text-muted-foreground">
                  Confirming transaction status with backend cryptographic verification.
                </p>
              </div>
            </div>
          )}

          {/* Verification Succeeded */}
          {!isPending && verifyData && (
            <div className="space-y-5 animate-in zoom-in-95">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 mx-auto shadow-sm">
                <CheckCircle2 className="size-10" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="size-3.5" />
                  <span>Stripe Verified</span>
                </span>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-2">
                  Payment Succeeded!
                </h1>
                <p className="text-xs text-muted-foreground">
                  Your payment has been reconciled. The invoice has been marked as PAID in full.
                </p>
              </div>

              {sessionId && (
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-left space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    Stripe Session Reference
                  </span>
                  <p className="font-mono text-xs text-foreground truncate">
                    {sessionId}
                  </p>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <Button asChild className="gap-2 shadow-xs">
                  <Link href="/dashboard/invoices">
                    <Receipt className="size-4" />
                    <span>View Invoices</span>
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Error / Not Verified */}
          {!isPending && !verifyData && (isError || !sessionId) && (
            <div className="space-y-5">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 mx-auto">
                <AlertCircle className="size-10" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">
                  Verification Pending or Incomplete
                </h2>
                <p className="text-xs text-muted-foreground">
                  {(error as any)?.message ||
                    "Could not automatically verify Stripe checkout session with backend. Please retry."}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button onClick={handleRetry} className="w-full">
                  Retry Status Verification
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/invoices">Go to Invoices</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
