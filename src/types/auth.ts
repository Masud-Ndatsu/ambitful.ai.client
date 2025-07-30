export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  profile?: {
    avatar?: string;
    bio?: string;
    location?: string;
    interests: string[];
  };
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
