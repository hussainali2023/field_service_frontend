import {
  createReviewApi,
  getAllReviewsApi,
  getTechnicianReviewsApi,
} from "@/api";
import { CreateReviewPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllReviews(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => getAllReviewsApi(params),
  });
}

export function useTechnicianReviews(technicianId: string) {
  return useQuery({
    queryKey: ["technician-reviews", technicianId],
    queryFn: () => getTechnicianReviewsApi(technicianId),
    enabled: !!technicianId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReviewApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
}
