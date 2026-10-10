import { z } from "zod";

export const createReviewSchema = z.object({
  serviceRequestId: z.string().uuid("Invalid service request ID"),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
});

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
