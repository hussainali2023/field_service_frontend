import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(7, "Please enter a valid phone number").optional().or(z.literal("")),
  role: z.enum(["CUSTOMER", "TECHNICIAN"]).optional().default("CUSTOMER"),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  serviceArea: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
