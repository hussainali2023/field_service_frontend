import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  AssignTechnicianPayload,
  CreateServiceRequestPayload,
  PaginationMeta,
  RequestStatus,
  ReviewServiceRequestPayload,
  ServiceRequest,
  SubmitServiceReportPayload,
  UpdateStatusPayload,
  UrgencyLevel,
} from "@/types";

interface GetRequestsParams {
  searchTerm?: string;
  status?: RequestStatus;
  urgency?: UrgencyLevel;
  serviceId?: string;
  technicianId?: string;
  customerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function getAllServiceRequestsApi(
  params?: GetRequestsParams
): Promise<ApiResponse<ServiceRequest[]> & { data: { requests: ServiceRequest[]; meta: PaginationMeta } }> {
  return apiClient("/service-requests", {
    method: "GET",
    params,
  });
}

export function getMyCustomerRequestsApi(
  params?: { page?: number; limit?: number; status?: RequestStatus }
): Promise<ApiResponse<any>> {
  return apiClient("/service-requests/my-requests", {
    method: "GET",
    params,
  });
}

export function getMyTechnicianAssignmentsApi(
  params?: { page?: number; limit?: number; status?: RequestStatus }
): Promise<ApiResponse<any>> {
  return apiClient("/service-requests/my-assignments", {
    method: "GET",
    params,
  });
}

export function getServiceRequestByIdApi(
  id: string
): Promise<ApiResponse<ServiceRequest>> {
  return apiClient(`/service-requests/${id}`, {
    method: "GET",
  });
}

export function createServiceRequestApi(
  payload: CreateServiceRequestPayload
): Promise<ApiResponse<ServiceRequest>> {
  return apiClient("/service-requests", {
    method: "POST",
    body: payload,
  });
}

export function reviewServiceRequestApi(
  id: string,
  payload: ReviewServiceRequestPayload
): Promise<ApiResponse<ServiceRequest>> {
  return apiClient(`/service-requests/${id}/review`, {
    method: "PATCH",
    body: payload,
  });
}

export function assignTechnicianApi(
  id: string,
  payload: AssignTechnicianPayload
): Promise<ApiResponse<ServiceRequest>> {
  return apiClient(`/service-requests/${id}/assign`, {
    method: "POST",
    body: payload,
  });
}

export function updateRequestStatusApi(
  id: string,
  payload: UpdateStatusPayload
): Promise<ApiResponse<ServiceRequest>> {
  return apiClient(`/service-requests/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function submitServiceReportApi(
  id: string,
  payload: SubmitServiceReportPayload
): Promise<ApiResponse<ServiceRequest>> {
  return apiClient(`/service-requests/${id}/report`, {
    method: "POST",
    body: payload,
  });
}

export function deleteServiceRequestApi(
  id: string
): Promise<ApiResponse<null>> {
  return apiClient(`/service-requests/${id}`, {
    method: "DELETE",
  });
}
