import {
  createCheckoutSessionApi,
  getPaymentByIdApi,
  verifyPaymentApi,
} from "@/api";
import { VerifyPaymentPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPaymentByIdApi(id),
    enabled: !!id,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (payload: { invoiceId: string }) =>
      createCheckoutSessionApi(payload),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => verifyPaymentApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["my-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
