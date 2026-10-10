import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  AuthResponse,
  ChangePasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types";

export function loginApi(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function googleLoginApi(
  payload: GoogleLoginPayload
): Promise<ApiResponse<AuthResponse>> {
  return apiClient("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function registerApi(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
  return apiClient("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function getMeApi(): Promise<ApiResponse<User>> {
  return apiClient("/auth/me", {
    method: "GET",
  });
}

export function changePasswordApi(
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> {
  return apiClient("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}

export function updateProfileApi(
  payload: UpdateProfilePayload
): Promise<ApiResponse<User>> {
  return apiClient("/users/me", {
    method: "PATCH",
    body: payload,
  });
}
