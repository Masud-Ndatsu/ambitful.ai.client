import { apiService } from "./api";
import {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
} from "../types/auth";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    apiService.setAuthToken(response.token);
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/register",
      userData
    );
    console.log({ response });
    apiService.setAuthToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post("/auth/logout");
    } finally {
      apiService.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>("/users/profile");
    console.log({ response });
    return response;
  }

  async updateProfile(profileData: Partial<User["profile"]>): Promise<User> {
    const response = await apiService.put<User>("/auth/profile", profileData);
    return response;
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiService.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiService.post("/auth/forgot-password", { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiService.post("/auth/reset-password", {
      token,
      newPassword,
    });
  }
}

export const authService = new AuthService();
