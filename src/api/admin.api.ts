import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  AuditLog,
  DashboardStatsResponse,
  PaginationMeta,
  User,
  UserStatus,
} from "@/types";

export function getDashboardStatsApi(): Promise<ApiResponse<DashboardStatsResponse>> {
  return apiClient("/admin/dashboard-stats", {
    method: "GET",
  });
}

export function getAuditLogsApi(params?: {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
}): Promise<ApiResponse<AuditLog[]> & { data: { logs: AuditLog[]; meta: PaginationMeta } }> {
  return apiClient("/admin/audit-logs", {
    method: "GET",
    params,
  });
}

export function getAllUsersApi(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
}): Promise<ApiResponse<User[]>> {
  return apiClient("/users", {
    method: "GET",
    params,
  });
}

export function updateUserStatusApi(
  id: string,
  payload: { status: UserStatus }
): Promise<ApiResponse<User>> {
  return apiClient(`/users/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteUserApi(id: string): Promise<ApiResponse<null>> {
  return apiClient(`/users/${id}`, {
    method: "DELETE",
  });
}
