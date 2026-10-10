import {
  changePasswordApi,
  getMeApi,
  googleLoginApi,
  loginApi,
  registerApi,
  updateProfileApi,
} from "@/api";
import { getStoredToken } from "@/lib/auth-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useGoogleOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleLoginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useGetMe() {
  const token = typeof window !== "undefined" ? getStoredToken() : null;
  return useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordApi,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
