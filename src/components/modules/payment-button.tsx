"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCreateCheckoutSession } from "@/hooks/payments.hook";
import { toast } from "@/components/ui/toast";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Invoice } from "@/types";

interface PaymentButtonProps {
  invoice: Invoice;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function PaymentButton({
  invoice,
  size = "default",
  className,
}: PaymentButtonProps) {
  const { mutate: createCheckout, isPending } = useCreateCheckoutSession();

  const handlePay = () => {
    if (invoice.status === "PAID") {
      toast.info("This invoice is already paid in full.");
      return;
    }

    createCheckout(
      { invoiceId: invoice.id },
      {
        onSuccess: (res) => {
          const { checkoutUrl } = res.data;
          if (checkoutUrl) {
            toast.info("Redirecting to secure Stripe Checkout...");
            window.location.href = checkoutUrl;
          } else {
            toast.error("Could not obtain Stripe checkout URL from server");
          }
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to initialize Stripe checkout session");
        },
      }
    );
  };

  if (invoice.status === "PAID") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
        Paid in Full ✓
      </span>
    );
  }

  return (
    <Button
      onClick={handlePay}
      size={size}
      variant="default"
      isLoading={isPending}
      className={`gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs ${className || ""}`}
    >
      <CreditCard className="size-4" />
      <span>Pay with Stripe</span>
      <ExternalLink className="size-3.5 opacity-80" />
    </Button>
  );
}
