import { Service } from "./service.type";
import { User, TechnicianProfile } from "./auth.type";
import { Invoice } from "./invoice.type";
import { Review } from "./review.type";

export type RequestStatus =
  | "REQUESTED"
  | "REVIEWED"
  | "ASSIGNED"
  | "SCHEDULED"
  | "ON_THE_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export interface RequestStatusLog {
  id: string;
  serviceRequestId: string;
  fromStatus?: RequestStatus | null;
  toStatus: RequestStatus;
  changedByUserId: string;
  notes?: string | null;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  serviceId: string;
  technicianId?: string | null;
  title: string;
  description: string;
  address: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  preferredDate: string;
  scheduledDate?: string | null;
  scheduledEndDate?: string | null;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  adminNotes?: string | null;
  cancellationReason?: string | null;
  serviceReport?: string | null;
  partsUsed?: string | null;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  service: Service;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  technician?: {
    id: string;
    skills: string[];
    experienceYears: number;
    hourlyRate: number;
    rating: number;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  } | null;
  invoice?: Invoice | null;
  review?: Review | null;
  statusLogs?: RequestStatusLog[];
}

export interface CreateServiceRequestPayload {
  serviceId: string;
  title: string;
  description: string;
  address: string;
  urgency: UrgencyLevel;
  preferredDate: string;
}

export interface ReviewServiceRequestPayload {
  estimatedPrice: number;
  adminNotes?: string;
  urgency?: UrgencyLevel;
}

export interface AssignTechnicianPayload {
  technicianId: string;
  scheduledDate: string;
  scheduledEndDate: string;
  notes?: string;
}

export interface UpdateStatusPayload {
  status: RequestStatus;
  notes?: string;
  cancellationReason?: string;
}

export interface SubmitServiceReportPayload {
  serviceReport: string;
  partsUsed?: string;
  finalPrice: number;
}
