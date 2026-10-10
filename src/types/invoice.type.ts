export type InvoiceStatus = "UNPAID" | "PAID" | "CANCELLED" | "REFUNDED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type PaymentMethod = "STRIPE" | "CASH" | "CARD";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string | null;
  stripePaymentIntentId?: string | null;
  createdAt: string;
  updatedAt: string;
  invoice?: Invoice;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  serviceRequestId: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  payments?: Payment[];
  serviceRequest?: {
    id: string;
    requestNumber: string;
    title: string;
    customerId: string;
    service?: {
      name: string;
    };
    customer?: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  };
}

export interface CreateInvoicePayload {
  serviceRequestId: string;
  amount: number;
  tax?: number;
  dueDate?: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  isSimulated?: boolean;
}

export interface VerifyPaymentPayload {
  sessionId: string;
  invoiceId?: string;
}

export interface VerifyPaymentResponse {
  message: string;
  payment: Payment;
  invoice?: Invoice;
}
