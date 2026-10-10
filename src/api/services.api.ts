import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  CreateServicePayload,
  Service,
  UpdateServicePayload,
} from "@/types";

export function getAllServicesApi(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
}): Promise<ApiResponse<Service[]>> {
  return apiClient("/services", {
    method: "GET",
    params,
  });
}

export function getServiceByIdApi(id: string): Promise<ApiResponse<Service>> {
  return apiClient(`/services/${id}`, {
    method: "GET",
  });
}

export function createServiceApi(
  payload: CreateServicePayload
): Promise<ApiResponse<Service>> {
  return apiClient("/services", {
    method: "POST",
    body: payload,
  });
}

export function updateServiceApi(
  id: string,
  payload: UpdateServicePayload
): Promise<ApiResponse<Service>> {
  return apiClient(`/services/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteServiceApi(id: string): Promise<ApiResponse<null>> {
  return apiClient(`/services/${id}`, {
    method: "DELETE",
  });
}
