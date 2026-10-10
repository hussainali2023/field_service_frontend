import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  basePrice: z.number().positive("Base price must be greater than 0"),
  estimatedDurationHours: z.number().positive("Estimated duration must be greater than 0"),
  isAvailable: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
