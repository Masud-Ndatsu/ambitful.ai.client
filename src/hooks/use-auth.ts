import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { authService } from "@/services/authService";
import { User, LoginCredentials, RegisterData } from "@/types";
import { useMutation } from "./use-api";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User["profile"]>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTokenExpired: () => boolean;
  getTokenExpiration: () => Date | null;
  checkAndRefreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for localStorage operations
const USER_STORAGE_KEY = "user_data";

const saveUserToStorage = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save user to localStorage:", error);
  }
};

const getUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Failed to retrieve user from localStorage:", error);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loginMutation = useMutation(authService.login);
  const registerMutation = useMutation(authService.register);
  const logoutMutation = useMutation(authService.logout);
  const updateProfileMutation = useMutation(authService.updateProfile);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists and is not expired
        if (authService.isTokenExpired()) {
          // Token is expired or doesn't exist, clear everything
          setUser(null);
          saveUserToStorage(null);
          setLoading(false);
          return;
        }

        // First, try to get user from localStorage
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
          setLoading(false);
        }

        // Then verify with the server
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        saveUserToStorage(currentUser);
      } catch (error) {
        // If server verification fails, clear stored user
        setUser(null);
        saveUserToStorage(null);
      } finally {
        setLoading(false);
      }
    };

    // Listen for token expiration events from API requests
    const handleTokenExpiration = () => {
      setUser(null);
      saveUserToStorage(null);
      toast({
        title: "Session expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
    };

    checkAuth();
    window.addEventListener('auth:token-expired', handleTokenExpiration);

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpiration);
    };
  }, [toast]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const authResponse = await loginMutation.mutate(credentials);
      setUser(authResponse.user);
      saveUserToStorage(authResponse.user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const authResponse = await registerMutation.mutate(userData);
      setUser(authResponse.user);
      saveUserToStorage(authResponse.user);
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error?.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutate();
    } finally {
      setUser(null);
      saveUserToStorage(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const updateProfile = async (profileData: Partial<User["profile"]>) => {
    try {
      const updatedUser = await updateProfileMutation.mutate(profileData);
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Token expiration methods
  const isTokenExpired = () => {
    return authService.isTokenExpired();
  };

  const getTokenExpiration = () => {
    return authService.getTokenExpiration();
  };

  const checkAndRefreshAuth = async () => {
    if (authService.isTokenExpired()) {
      setUser(null);
      saveUserToStorage(null);
      toast({
        title: "Session expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      saveUserToStorage(currentUser);
    } catch (error) {
      setUser(null);
      saveUserToStorage(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isTokenExpired,
    getTokenExpiration,
    checkAndRefreshAuth,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
