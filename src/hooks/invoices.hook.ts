import {
  cancelInvoiceApi,
  createInvoiceApi,
  getAllInvoicesApi,
  getInvoiceByIdApi,
  getMyInvoicesApi,
} from "@/api";
import { CreateInvoicePayload, InvoiceStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useInvoices(params?: {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
}) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => getAllInvoicesApi(params),
  });
}

export function useMyInvoices(params?: {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
}) {
  return useQuery({
    queryKey: ["my-invoices", params],
    queryFn: () => getMyInvoicesApi(params),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvoicePayload) => createInvoiceApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelInvoiceApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
    },
  });
}
