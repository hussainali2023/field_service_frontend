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
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReport } from "@/hooks/requests.hook";
import { toast } from "@/components/ui/toast";
import { submitReportSchema } from "@/validation";
import { ServiceRequest } from "@/types";

interface ReportModalProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReportModal({
  request,
  open,
  onOpenChange,
  onSuccess,
}: ReportModalProps) {
  const { mutate: submitReport, isPending } = useSubmitReport();

  const [serviceReport, setServiceReport] = React.useState("");
  const [partsUsed, setPartsUsed] = React.useState("");
  const [finalPrice, setFinalPrice] = React.useState<number>(0);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (request && open) {
      setServiceReport(request.serviceReport || "");
      setPartsUsed(request.partsUsed || "");
      setFinalPrice(request.finalPrice || request.estimatedPrice || request.service?.basePrice || 120);
      setErrors({});
    }
  }, [request, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    const payload = {
      serviceReport,
      partsUsed: partsUsed || undefined,
      finalPrice: Number(finalPrice),
    };

    const validation = submitReportSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    submitReport(
      { id: request.id, payload },
      {
        onSuccess: () => {
          toast.success("Service report filed & work order marked as COMPLETED! Invoice generated.");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to submit report");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Work Order & File Report</DialogTitle>
          <DialogDescription>
            Document findings, repairs conducted, parts installed, and the final billable price.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Service Findings Report */}
            <Field data-invalid={!!errors.serviceReport}>
              <FieldLabel htmlFor="serviceReport">Service Findings & Work Carried Out</FieldLabel>
              <Textarea
                id="serviceReport"
                placeholder="Detailed report of diagnosis, replaced components, diagnostic testing, customer verification..."
                value={serviceReport}
                onChange={(e) => setServiceReport(e.target.value)}
                rows={4}
              />
              <FieldError error={errors.serviceReport} />
            </Field>

            {/* Parts Used */}
            <Field>
              <FieldLabel htmlFor="partsUsed">Parts & Materials Used</FieldLabel>
              <Input
                id="partsUsed"
                placeholder="e.g., 1x Run Capacitor 45uF, 2x Brass fittings 3/4in"
                value={partsUsed}
                onChange={(e) => setPartsUsed(e.target.value)}
              />
            </Field>

            {/* Final Price */}
            <Field data-invalid={!!errors.finalPrice}>
              <FieldLabel htmlFor="finalPrice">Final Total Price ($ USD)</FieldLabel>
              <Input
                id="finalPrice"
                type="number"
                step="0.01"
                min="1"
                value={finalPrice}
                onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
              />
              <FieldError error={errors.finalPrice} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" isLoading={isPending}>
              Submit Report & Complete Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
