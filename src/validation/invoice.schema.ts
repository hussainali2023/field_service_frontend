import { z } from "zod";

export const createInvoiceSchema = z.object({
  serviceRequestId: z.string().uuid("Invalid service request ID"),
  amount: z.number().positive("Amount must be greater than 0"),
  tax: z.number().nonnegative("Tax cannot be negative").default(0),
  dueDate: z.string().optional(),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;
