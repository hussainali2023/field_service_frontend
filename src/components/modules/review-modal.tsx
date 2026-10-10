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
import { useReviewRequest } from "@/hooks/requests.hook";
import { toast } from "@/components/ui/toast";
import { reviewRequestSchema } from "@/validation";
import { ServiceRequest, UrgencyLevel } from "@/types";

interface ReviewModalProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReviewModal({
  request,
  open,
  onOpenChange,
  onSuccess,
}: ReviewModalProps) {
  const { mutate: review, isPending } = useReviewRequest();

  const [estimatedPrice, setEstimatedPrice] = React.useState<number>(0);
  const [urgency, setUrgency] = React.useState<UrgencyLevel>("MEDIUM");
  const [adminNotes, setAdminNotes] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (request && open) {
      setEstimatedPrice(request.estimatedPrice || request.service?.basePrice || 100);
      setUrgency(request.urgency || "MEDIUM");
      setAdminNotes(request.adminNotes || "");
      setErrors({});
    }
  }, [request, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    const payload = {
      estimatedPrice: Number(estimatedPrice),
      urgency,
      adminNotes: adminNotes || undefined,
    };

    const validation = reviewRequestSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    review(
      { id: request.id, payload },
      {
        onSuccess: () => {
          toast.success("Service request reviewed and marked as REVIEWED");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to submit review");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Triage & Review Request</DialogTitle>
          <DialogDescription>
            Verify request scope, confirm pricing estimate, and add dispatcher notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Estimated Price */}
            <Field data-invalid={!!errors.estimatedPrice}>
              <FieldLabel htmlFor="estimatedPrice">Estimated Price ($ USD)</FieldLabel>
              <Input
                id="estimatedPrice"
                type="number"
                step="0.01"
                min="1"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
              />
              <FieldError error={errors.estimatedPrice} />
            </Field>

            {/* Urgency */}
            <Field>
              <FieldLabel htmlFor="urgency">Urgency Level</FieldLabel>
              <select
                id="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </Field>

            {/* Dispatcher Notes */}
            <Field>
              <FieldLabel htmlFor="adminNotes">Internal Review Notes</FieldLabel>
              <Textarea
                id="adminNotes"
                placeholder="Diagnostic expectations, preliminary parts needed..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
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
            <Button type="submit" isLoading={isPending}>
              Approve & Set Reviewed
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
