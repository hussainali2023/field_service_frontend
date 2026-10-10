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
import { useAssignTechnician } from "@/hooks/requests.hook";
import { useTechnicians } from "@/hooks/technicians.hook";
import { toast } from "@/components/ui/toast";
import { assignTechnicianSchema } from "@/validation";
import { ServiceRequest } from "@/types";

interface AssignModalProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignModal({
  request,
  open,
  onOpenChange,
  onSuccess,
}: AssignModalProps) {
  const { data: techData, isLoading: loadingTechs } = useTechnicians();
  const { mutate: assign, isPending } = useAssignTechnician();

  const [technicianId, setTechnicianId] = React.useState("");
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledEndDate, setScheduledEndDate] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const technicians = techData?.data || [];

  React.useEffect(() => {
    if (request && open) {
      const preferred = request.preferredDate
        ? new Date(request.preferredDate).toISOString().slice(0, 16)
        : "";
      setScheduledDate(preferred);
      if (preferred) {
        const end = new Date(new Date(request.preferredDate).getTime() + 2 * 60 * 60 * 1000);
        setScheduledEndDate(end.toISOString().slice(0, 16));
      }
      setTechnicianId(request.technicianId || "");
      setNotes("");
      setErrors({});
    }
  }, [request, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    const payload = {
      technicianId,
      scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : "",
      scheduledEndDate: scheduledEndDate ? new Date(scheduledEndDate).toISOString() : "",
      notes,
    };

    const validation = assignTechnicianSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    assign(
      { id: request.id, payload },
      {
        onSuccess: () => {
          toast.success("Technician assigned and visit scheduled successfully");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to assign technician");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Technician & Schedule Visit</DialogTitle>
          <DialogDescription>
            Work Order #{request?.requestNumber}: {request?.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Technician Select */}
            <Field data-invalid={!!errors.technicianId}>
              <FieldLabel htmlFor="technicianId">Select Certified Technician</FieldLabel>
              <select
                id="technicianId"
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                disabled={loadingTechs}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">-- Choose a Technician --</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.user.name} ({tech.serviceArea} • {tech.skills.join(", ")}) - ${tech.hourlyRate}/hr
                  </option>
                ))}
              </select>
              <FieldError error={errors.technicianId} />
            </Field>

            {/* Start Date */}
            <Field data-invalid={!!errors.scheduledDate}>
              <FieldLabel htmlFor="scheduledDate">Scheduled Start Date & Time</FieldLabel>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <FieldError error={errors.scheduledDate} />
            </Field>

            {/* End Date */}
            <Field data-invalid={!!errors.scheduledEndDate}>
              <FieldLabel htmlFor="scheduledEndDate">Scheduled End Date & Time</FieldLabel>
              <Input
                id="scheduledEndDate"
                type="datetime-local"
                value={scheduledEndDate}
                onChange={(e) => setScheduledEndDate(e.target.value)}
              />
              <FieldError error={errors.scheduledEndDate} />
            </Field>

            {/* Notes */}
            <Field>
              <FieldLabel htmlFor="notes">Dispatch Notes (Optional)</FieldLabel>
              <Textarea
                id="notes"
                placeholder="Special equipment needed, gate code, customer instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
              Confirm Assignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
