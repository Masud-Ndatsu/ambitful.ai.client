/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/config";

// Generic API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiService {
  private baseURL = env.API_URL;
  private token: string | null = null;

  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  getAuthToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  clearAuthToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log({ response: data });

      if (!response.ok) {
        throw {
          message: data?.error?.message || "Request failed",
          status: response.status,
          code: data.code,
        } as ApiError;
      }

      // Expect API responses to follow: { success: boolean, data: T, message: string }
      if (data.success !== undefined && data.data !== undefined) {
        return data.data;
      }

      // Fallback for responses that don't follow the standard format
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiService = new ApiService();
