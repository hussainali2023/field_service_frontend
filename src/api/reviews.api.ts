import apiClient from "@/lib/apiClient";
import { ApiResponse, CreateReviewPayload, Review } from "@/types";

export function createReviewApi(
  payload: CreateReviewPayload
): Promise<ApiResponse<Review>> {
  return apiClient("/reviews", {
    method: "POST",
    body: payload,
  });
}

export function getAllReviewsApi(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Review[]>> {
  return apiClient("/reviews", {
    method: "GET",
    params,
  });
}

export function getTechnicianReviewsApi(
  technicianId: string
): Promise<ApiResponse<Review[]>> {
  return apiClient(`/reviews/technician/${technicianId}`, {
    method: "GET",
  });
}
