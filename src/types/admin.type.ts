import { User } from "./auth.type";
import { ServiceRequest } from "./request.type";

export interface DashboardOverviewStats {
  totalUsers: number;
  customersCount: number;
  techniciansCount: number;
  adminsCount: number;
  totalRequests: number;
  completedRequests: number;
  inProgressRequests: number;
  totalRevenue: number;
  totalCompletedPayments: number;
  unpaidInvoicesCount: number;
  unpaidInvoicesTotal: number;
}

export interface DashboardStatsResponse {
  overview: DashboardOverviewStats;
  requestsByStatus: Record<string, number>;
  recentRequests: ServiceRequest[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details?: any;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}
