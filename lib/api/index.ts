"use client";

import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import type { ApiError, ApiResponse } from "./types";

export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return unwrap(response);
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return unwrap(response);
}

export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
  return unwrap(response);
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return unwrap(response);
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return unwrap(response);
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}
