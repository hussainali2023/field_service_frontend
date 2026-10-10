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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateStatus } from "@/hooks/requests.hook";
import { toast } from "@/components/ui/toast";
import { RequestStatus, ServiceRequest } from "@/types";

interface StatusModalProps {
  request: ServiceRequest | null;
  targetStatus: RequestStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StatusModal({
  request,
  targetStatus,
  open,
  onOpenChange,
  onSuccess,
}: StatusModalProps) {
  const { mutate: updateStatus, isPending } = useUpdateStatus();
  const [notes, setNotes] = React.useState("");
  const [cancellationReason, setCancellationReason] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setNotes("");
      setCancellationReason("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !targetStatus) return;

    updateStatus(
      {
        id: request.id,
        payload: {
          status: targetStatus,
          notes: notes || undefined,
          cancellationReason:
            targetStatus === "CANCELLED" ? cancellationReason || "User cancelled" : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Request status updated to ${targetStatus}`);
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update status");
        },
      }
    );
  };

  const isCancel = targetStatus === "CANCELLED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCancel ? "Cancel Service Request" : `Update Status to ${targetStatus}`}
          </DialogTitle>
          <DialogDescription>
            {isCancel
              ? "Please provide a reason for cancelling this request."
              : `Confirm transitioning Request #${request?.requestNumber} to ${targetStatus}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {isCancel && (
              <Field>
                <FieldLabel htmlFor="cancellationReason">Cancellation Reason</FieldLabel>
                <Input
                  id="cancellationReason"
                  placeholder="e.g., Problem resolved, rescheduling needed..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  required
                />
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="statusNotes">Status Log Notes (Optional)</FieldLabel>
              <Textarea
                id="statusNotes"
                placeholder="Optional notes to record in timeline audit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant={isCancel ? "destructive" : "default"}
              isLoading={isPending}
            >
              {isCancel ? "Confirm Cancellation" : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
