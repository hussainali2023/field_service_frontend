import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { RequestStatus, UrgencyLevel, InvoiceStatus, PaymentStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num === null || num === undefined || isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(d, "MMM d, yyyy");
  } catch {
    return String(dateString);
  }
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(d, "MMM d, yyyy 'at' h:mm a");
  } catch {
    return String(dateString);
  }
}

export function formatRelativeTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return String(dateString);
  }
}

export function getStatusBadgeConfig(status: RequestStatus | string): {
  label: string;
  className: string;
  dotColor: string;
} {
  switch (status) {
    case "REQUESTED":
      return {
        label: "Requested",
        className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
        dotColor: "bg-blue-500",
      };
    case "REVIEWED":
      return {
        label: "Reviewed",
        className: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
        dotColor: "bg-indigo-500",
      };
    case "ASSIGNED":
      return {
        label: "Assigned",
        className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
        dotColor: "bg-purple-500",
      };
    case "SCHEDULED":
      return {
        label: "Scheduled",
        className: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
        dotColor: "bg-cyan-500",
      };
    case "ON_THE_WAY":
      return {
        label: "On The Way",
        className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        dotColor: "bg-amber-500",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        className: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800",
        dotColor: "bg-yellow-500",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
        dotColor: "bg-emerald-500",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
        dotColor: "bg-rose-500",
      };
    default:
      return {
        label: String(status || "Unknown"),
        className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        dotColor: "bg-slate-400",
      };
  }
}

export function getUrgencyBadgeConfig(urgency: UrgencyLevel | string): {
  label: string;
  className: string;
} {
  switch (urgency) {
    case "LOW":
      return {
        label: "Low",
        className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      };
    case "MEDIUM":
      return {
        label: "Medium",
        className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
      };
    case "HIGH":
      return {
        label: "High",
        className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      };
    case "EMERGENCY":
      return {
        label: "Emergency",
        className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 font-semibold animate-pulse",
      };
    default:
      return {
        label: String(urgency || "Normal"),
        className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      };
  }
}

export function getInvoiceStatusConfig(status: InvoiceStatus | string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      };
    case "UNPAID":
      return {
        label: "Unpaid",
        className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
      };
    default:
      return {
        label: String(status || "Unknown"),
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}
