import apiClient from "@/lib/apiClient";
import { ApiResponse, CreateInvoicePayload, Invoice, InvoiceStatus } from "@/types";

export function getAllInvoicesApi(params?: {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
}): Promise<ApiResponse<Invoice[]>> {
  return apiClient("/invoices", {
    method: "GET",
    params,
  });
}

export function getMyInvoicesApi(params?: {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
}): Promise<ApiResponse<Invoice[]>> {
  return apiClient("/invoices/my-invoices", {
    method: "GET",
    params,
  });
}

export function getInvoiceByIdApi(id: string): Promise<ApiResponse<Invoice>> {
  return apiClient(`/invoices/${id}`, {
    method: "GET",
  });
}

export function createInvoiceApi(
  payload: CreateInvoicePayload
): Promise<ApiResponse<Invoice>> {
  return apiClient("/invoices", {
    method: "POST",
    body: payload,
  });
}

export function cancelInvoiceApi(id: string): Promise<ApiResponse<Invoice>> {
  return apiClient(`/invoices/${id}/cancel`, {
    method: "PATCH",
  });
}
