import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  CreateTechnicianPayload,
  TechnicianAvailabilityResponse,
  TechnicianWithUser,
  UpdateTechnicianPayload,
} from "@/types";

export function getAllTechniciansApi(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isAvailable?: boolean;
}): Promise<ApiResponse<TechnicianWithUser[]>> {
  return apiClient("/technicians", {
    method: "GET",
    params,
  });
}

export function getTechnicianByIdApi(
  id: string
): Promise<ApiResponse<TechnicianWithUser>> {
  return apiClient(`/technicians/${id}`, {
    method: "GET",
  });
}

export function checkTechnicianAvailabilityApi(
  id: string,
  params?: { date?: string }
): Promise<ApiResponse<TechnicianAvailabilityResponse>> {
  return apiClient(`/technicians/${id}/availability`, {
    method: "GET",
    params,
  });
}

export function createTechnicianApi(
  payload: CreateTechnicianPayload
): Promise<ApiResponse<TechnicianWithUser>> {
  return apiClient("/technicians", {
    method: "POST",
    body: payload,
  });
}

export function updateTechnicianApi(
  id: string,
  payload: UpdateTechnicianPayload
): Promise<ApiResponse<TechnicianWithUser>> {
  return apiClient(`/technicians/${id}`, {
    method: "PATCH",
    body: payload,
  });
}
