import {
  checkTechnicianAvailabilityApi,
  createTechnicianApi,
  getAllTechniciansApi,
  getTechnicianByIdApi,
  updateTechnicianApi,
} from "@/api";
import { CreateTechnicianPayload, UpdateTechnicianPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTechnicians(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isAvailable?: boolean;
}) {
  return useQuery({
    queryKey: ["technicians", params],
    queryFn: () => getAllTechniciansApi(params),
    staleTime: 60 * 1000,
  });
}

export function useTechnician(id: string) {
  return useQuery({
    queryKey: ["technician", id],
    queryFn: () => getTechnicianByIdApi(id),
    enabled: !!id,
  });
}

export function useTechnicianAvailability(id: string, date?: string) {
  return useQuery({
    queryKey: ["technician-availability", id, date],
    queryFn: () => checkTechnicianAvailabilityApi(id, { date }),
    enabled: !!id,
  });
}

export function useCreateTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTechnicianPayload) =>
      createTechnicianApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}

export function useUpdateTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTechnicianPayload;
    }) => updateTechnicianApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      queryClient.invalidateQueries({ queryKey: ["technician", variables.id] });
    },
  });
}
