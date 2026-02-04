"use client";

import { useState, useEffect, useCallback } from "react";

import type { User, LoginRequest, SignupRequest } from "@/types/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Mock user for development bypass
const MOCK_DEV_USER: User = {
  id: "dev-user-123",
  email: "developer@example.com",
  name: "Dev User",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Load user from session storage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        console.log(
          "🚀 ~ loadUser ~ (process.env.NEXT_PUBLIC_BYPASS_AUTH:",
          process.env.NEXT_PUBLIC_BYPASS_AUTH
        );
        // Development bypass - automatically log in mock user
        if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
          console.log(
            "🚀 Development mode: Bypassing authentication with mock user"
          );
          setState({
            user: MOCK_DEV_USER,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          return;
        }

        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to restore session",
        }));
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { data: user } = await response.json();

      // Store user in localStorage for session persistence
      localStorage.setItem("auth_user", JSON.stringify(user));

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signup = useCallback(async (userData: SignupRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const { data: user } = await response.json();

      // Store user in localStorage for session persistence
      localStorage.setItem("auth_user", JSON.stringify(user));

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Don't actually logout in development bypass mode - just show a message
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
        console.log("🚀 Development mode: Logout bypassed, staying logged in");
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      // Only clear in production or when bypass is disabled
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH !== "true") {
        // Clear user from localStorage
        localStorage.removeItem("auth_user");

        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };
}
