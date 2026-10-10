import {
  deleteUserApi,
  getAllUsersApi,
  getAuditLogsApi,
  getDashboardStatsApi,
  updateUserStatusApi,
} from "@/api";
import { UserStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsApi,
    refetchInterval: 60 * 1000,
  });
}

export function useAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
}) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogsApi(params),
  });
}

export function useUsers(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsersApi(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatusApi(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
