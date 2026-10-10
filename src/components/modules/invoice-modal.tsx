"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCreateInvoice } from "@/hooks/invoices.hook";
import { toast } from "@/components/ui/toast";
import { createInvoiceSchema } from "@/validation";
import { ServiceRequest } from "@/types";

interface InvoiceModalProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InvoiceModal({
  request,
  open,
  onOpenChange,
  onSuccess,
}: InvoiceModalProps) {
  const { mutate: createInvoice, isPending } = useCreateInvoice();

  const [amount, setAmount] = React.useState<number>(0);
  const [tax, setTax] = React.useState<number>(0);
  const [dueDate, setDueDate] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (request && open) {
      const base = request.finalPrice || request.estimatedPrice || request.service?.basePrice || 100;
      setAmount(base);
      setTax(Math.round(base * 0.1 * 100) / 100);
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      setDueDate(nextWeek);
      setErrors({});
    }
  }, [request, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    const payload = {
      serviceRequestId: request.id,
      amount: Number(amount),
      tax: Number(tax),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    const validation = createInvoiceSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    createInvoice(payload, {
      onSuccess: () => {
        toast.success("Invoice generated successfully");
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to generate invoice");
      },
    });
  };

  const total = (Number(amount) || 0) + (Number(tax) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Issue Official Invoice</DialogTitle>
          <DialogDescription>
            Generate billable invoice for Request #{request?.requestNumber}: {request?.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Amount */}
            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="amount">Subtotal Amount ($ USD)</FieldLabel>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setAmount(val);
                  setTax(Math.round(val * 0.1 * 100) / 100);
                }}
              />
              <FieldError error={errors.amount} />
            </Field>

            {/* Tax */}
            <Field data-invalid={!!errors.tax}>
              <FieldLabel htmlFor="tax">Estimated Tax / Fees ($ USD)</FieldLabel>
              <Input
                id="tax"
                type="number"
                step="0.01"
                min="0"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              />
              <FieldError error={errors.tax} />
            </Field>

            {/* Due Date */}
            <Field>
              <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Field>

            {/* Total Pill */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Invoice Balance
              </span>
              <span className="text-base font-extrabold text-foreground">
                ${total.toFixed(2)} USD
              </span>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Issue Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
