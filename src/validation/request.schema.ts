import { z } from "zod";

export const createRequestSchema = z.object({
  serviceId: z.string().uuid("Please select a valid service"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "EMERGENCY"], {
    message: "Please select an urgency level",
  }),
  preferredDate: z.string().min(1, "Preferred date is required"),
});

export type CreateRequestFormData = z.infer<typeof createRequestSchema>;

export const reviewRequestSchema = z.object({
  estimatedPrice: z.number().positive("Estimated price must be greater than 0"),
  adminNotes: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "EMERGENCY"]).optional(),
});

export type ReviewRequestFormData = z.infer<typeof reviewRequestSchema>;

export const assignTechnicianSchema = z.object({
  technicianId: z.string().uuid("Please select a technician"),
  scheduledDate: z.string().min(1, "Scheduled start date is required"),
  scheduledEndDate: z.string().min(1, "Scheduled end date is required"),
  notes: z.string().optional(),
});

export type AssignTechnicianFormData = z.infer<typeof assignTechnicianSchema>;

export const updateStatusSchema = z.object({
  status: z.enum([
    "REQUESTED",
    "REVIEWED",
    "ASSIGNED",
    "SCHEDULED",
    "ON_THE_WAY",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

export const submitReportSchema = z.object({
  serviceReport: z.string().min(10, "Service report must be at least 10 characters"),
  partsUsed: z.string().optional(),
  finalPrice: z.number().positive("Final price must be greater than 0"),
});

export type SubmitReportFormData = z.infer<typeof submitReportSchema>;
