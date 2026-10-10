import { ofetch, FetchOptions } from "ofetch";
import { getStoredToken, removeStoredToken } from "./auth-storage";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://field-service-backend-mu.vercel.app/api/v1";

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = getStoredToken();
    if (token) {
      options.headers = new Headers(options.headers);
      options.headers.set("Authorization", `Bearer ${token}`);
    }
  },
  onResponseError({ response }) {
    if (response?.status === 401) {
      removeStoredToken();
    }
    const message =
      response?._data?.message ||
      response?._data?.error ||
      response?.statusText ||
      "An unexpected error occurred";
    throw new Error(message);
  },
});

export default apiClient;
