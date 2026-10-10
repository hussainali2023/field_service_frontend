import { User, TechnicianProfile } from "./auth.type";

export interface TechnicianWithUser extends TechnicianProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
}

export interface CreateTechnicianPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number;
  serviceArea: string;
  bio?: string;
}

export interface UpdateTechnicianPayload {
  skills?: string[];
  experienceYears?: number;
  hourlyRate?: number;
  serviceArea?: string;
  bio?: string;
  isAvailable?: boolean;
}

export interface TechnicianAvailabilityResponse {
  technicianId: string;
  isAvailable: boolean;
  upcomingAssignmentsCount: number;
}
