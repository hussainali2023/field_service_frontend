export interface Review {
  id: string;
  serviceRequestId: string;
  customerId: string;
  technicianId?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
  };
}

export interface CreateReviewPayload {
  serviceRequestId: string;
  rating: number;
  comment: string;
}
