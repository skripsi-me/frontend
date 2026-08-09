"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiError, ApiErrorResponse } from "./types";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/api/auth/refresh")
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function normalizeError(error: AxiosError<ApiErrorResponse>): ApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data;
  return {
    status,
    message: data?.metadata?.message ?? error.message ?? "Terjadi kesalahan",
    fieldErrors: data?.error,
  };
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as RetriableConfig | undefined;
    const url = original?.url ?? "";
    const isAuthRoute =
      url.includes("/api/auth/login") || url.includes("/api/auth/refresh");

    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return apiClient(original);
      }
    }

    return Promise.reject(normalizeError(error));
  },
);
