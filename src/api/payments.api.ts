import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  CheckoutSessionResponse,
  Payment,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "@/types";

export function createCheckoutSessionApi(payload: {
  invoiceId: string;
}): Promise<ApiResponse<CheckoutSessionResponse>> {
  return apiClient("/payments/create-checkout-session", {
    method: "POST",
    body: payload,
  });
}

export function verifyPaymentApi(
  payload: VerifyPaymentPayload
): Promise<ApiResponse<VerifyPaymentResponse>> {
  return apiClient("/payments/verify", {
    method: "POST",
    body: payload,
  });
}

export function getPaymentByIdApi(id: string): Promise<ApiResponse<Payment>> {
  return apiClient(`/payments/${id}`, {
    method: "GET",
  });
}
