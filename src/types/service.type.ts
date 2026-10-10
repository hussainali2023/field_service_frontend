export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  estimatedDurationHours: number;
  isAvailable: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  estimatedDurationHours: number;
  isAvailable?: boolean;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  category?: string;
  basePrice?: number;
  estimatedDurationHours?: number;
  isAvailable?: boolean;
}
