/**
 * API Client for WhatsMaster Suite
 * This module provides a centralized API client with proper error handling,
 * authentication, and type safety.
 */

import { LoginRequest, User } from "@workspace/api-client-react";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_TIMEOUT = 30000; // 30 seconds

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Helper function to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem("whatsmaster_token");
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      errorData.code
    );
  }
  
  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  
  return {} as T;
}

// Base fetch with timeout and auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(408, "Request timeout. Please try again.");
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(500, "Network error. Please check your connection.");
  }
}

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<{ user: User; token: string }> => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async (): Promise<void> => {
    return apiFetch("/auth/logout", {
      method: "POST",
    });
  },

  me: async (): Promise<User> => {
    return apiFetch("/auth/me");
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    return apiFetch("/dashboard/stats");
  },
  
  getActivity: async () => {
    return apiFetch("/dashboard/activity");
  },
};

// Contacts API
export const contactsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.search) queryParams.set("search", params.search);
    
    const query = queryParams.toString();
    return apiFetch(`/contacts${query ? `?${query}` : ""}`);
  },

  get: async (id: string) => {
    return apiFetch(`/contacts/${id}`);
  },

  create: async (data: unknown) => {
    return apiFetch("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: unknown) => {
    return apiFetch(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/contacts/${id}`, {
      method: "DELETE",
    });
  },
};

// Conversations API
export const conversationsApi = {
  list: async (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.status) queryParams.set("status", params.status);
    
    const query = queryParams.toString();
    return apiFetch(`/conversations${query ? `?${query}` : ""}`);
  },

  get: async (id: string) => {
    return apiFetch(`/conversations/${id}`);
  },

  sendMessage: async (conversationId: string, message: string) => {
    return apiFetch(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content: message }),
    });
  },
};

// Campaigns API
export const campaignsApi = {
  list: async (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.status) queryParams.set("status", params.status);
    
    const query = queryParams.toString();
    return apiFetch(`/campaigns${query ? `?${query}` : ""}`);
  },

  get: async (id: string) => {
    return apiFetch(`/campaigns/${id}`);
  },

  create: async (data: unknown) => {
    return apiFetch("/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: unknown) => {
    return apiFetch(`/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/campaigns/${id}`, {
      method: "DELETE",
    });
  },

  send: async (id: string) => {
    return apiFetch(`/campaigns/${id}/send`, {
      method: "POST",
    });
  },
};

// Analytics API
export const analyticsApi = {
  getOverview: async (period?: string) => {
    const query = period ? `?period=${period}` : "";
    return apiFetch(`/analytics/overview${query}`);
  },

  getMessages: async (period?: string) => {
    const query = period ? `?period=${period}` : "";
    return apiFetch(`/analytics/messages${query}`);
  },

  getCampaigns: async (period?: string) => {
    const query = period ? `?period=${period}` : "";
    return apiFetch(`/analytics/campaigns${query}`);
  },
};

// Export default API client
export default {
  auth: authApi,
  dashboard: dashboardApi,
  contacts: contactsApi,
  conversations: conversationsApi,
  campaigns: campaignsApi,
  analytics: analyticsApi,
};
