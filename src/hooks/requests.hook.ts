import {
  assignTechnicianApi,
  createServiceRequestApi,
  deleteServiceRequestApi,
  getAllServiceRequestsApi,
  getMyCustomerRequestsApi,
  getMyTechnicianAssignmentsApi,
  getServiceRequestByIdApi,
  reviewServiceRequestApi,
  submitServiceReportApi,
  updateRequestStatusApi,
} from "@/api";
import {
  AssignTechnicianPayload,
  CreateServiceRequestPayload,
  RequestStatus,
  ReviewServiceRequestPayload,
  SubmitServiceReportPayload,
  UpdateStatusPayload,
  UrgencyLevel,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllRequests(params?: {
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
}) {
  return useQuery({
    queryKey: ["service-requests", params],
    queryFn: () => getAllServiceRequestsApi(params),
  });
}

export function useMyRequests(params?: {
  page?: number;
  limit?: number;
  status?: RequestStatus;
}) {
  return useQuery({
    queryKey: ["my-requests", params],
    queryFn: () => getMyCustomerRequestsApi(params),
  });
}

export function useMyAssignments(params?: {
  page?: number;
  limit?: number;
  status?: RequestStatus;
}) {
  return useQuery({
    queryKey: ["my-assignments", params],
    queryFn: () => getMyTechnicianAssignmentsApi(params),
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ["service-request", id],
    queryFn: () => getServiceRequestByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateServiceRequestPayload) =>
      createServiceRequestApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useReviewRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewServiceRequestPayload;
    }) => reviewServiceRequestApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-request", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useAssignTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AssignTechnicianPayload;
    }) => assignTechnicianApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-request", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStatusPayload;
    }) => updateRequestStatusApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-request", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useSubmitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SubmitServiceReportPayload;
    }) => submitServiceReportApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-request", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["my-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteServiceRequestApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
}
