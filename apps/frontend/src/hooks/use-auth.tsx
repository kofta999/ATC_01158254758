import * as React from "react";
import { baseApiClient } from "./use-api-client";
import { router } from "@/main";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

export interface User {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // Add user to the context type
  login: (
    email: string,
    password: string,
    role: "USER" | "ADMIN",
  ) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: (redirectToLogin?: boolean) => Promise<void>; // redirectToLogin is now optional
  token: string | null;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

const key = "auth.accessToken";

function getStoredToken() {
  return localStorage.getItem(key);
}

function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(key, token);
  } else {
    localStorage.removeItem(key);
  }
}

// Helper to decode token and get user, or return null if invalid/error
function getUserFromToken(token: string | null): User | null {
  if (!token) return null;
  try {
    const decodedToken: {
      userId: string;
      email: string;
      role: "USER" | "ADMIN";
      exp: number;
    } = jwtDecode(token);

    // Check for token expiration if needed, though API should handle this with 401
    if (decodedToken.exp * 1000 < Date.now()) {
      console.warn("Token expired.");
      setStoredToken(null); // Clear expired token
      return null;
    }

    return {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    setStoredToken(null); // Clear invalid token
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(getStoredToken());
  const [user, setUser] = React.useState<User | null>(() =>
    getUserFromToken(token),
  ); // Initialize user from stored token
  const isAuthenticated = !!token && !!user; // User must also be valid

  const logout = React.useCallback(async (redirectToLogin?: boolean) => {
    setStoredToken(null);
    setToken(null);
    setUser(null); // Clear user state
    if (redirectToLogin) {
      router.navigate({ to: "/login" }); // Default to user login, admin might need specific redirect
    }
  }, []);

  const login = React.useCallback(
    async (email: string, password: string, role: "USER" | "ADMIN") => {
      try {
        const response = await baseApiClient.auth.login.$post({
          json: { email, password, role },
        });

        if (!response.ok) {
          // Try to parse error from backend
          let errorMessage = "Login failed. Please check your credentials.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            /* ignore if error response is not JSON */
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const accessToken = data.token;

        setStoredToken(accessToken);
        setToken(accessToken);
        const currentUser = getUserFromToken(accessToken);
        setUser(currentUser);

        return !!currentUser; // Login successful if user could be decoded
      } catch (error: any) {
        console.error("Login failed:", error);
        // It's better to handle error display in the component using the login form
        // For now, keeping alert for immediate feedback, but consider removing/replacing.
        alert(error.message || "An unknown error occurred during login.");
        setUser(null); // Ensure user is null on login failure
        return false;
      }
    },
    [],
  );

  const register = React.useCallback(
    async (email: string, password: string) => {
      try {
        const response = await baseApiClient.auth.register.$post({
          json: { email, password },
        });

        if (!response.ok) {
          let errorMessage = "Registration failed. Please try again.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            /* ignore */
          }
          throw new Error(errorMessage);
        }
        // Typically, successful registration prompts the user to login.
        // Or, if the backend auto-logs in and returns a token, handle that like the login flow.
        return true;
      } catch (error: any) {
        console.error("Registration failed:", error);
        alert(
          error.message || "An unknown error occurred during registration.",
        );
        return false;
      }
    },
    [],
  );

  // Effect to sync user state if token changes externally (e.g. another tab logs out)
  // Also handles initial load based on stored token.
  React.useEffect(() => {
    const currentToken = getStoredToken();
    setToken(currentToken);
    setUser(getUserFromToken(currentToken));

    // Optional: Listen to storage events to sync across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        const newToken = event.newValue;
        setToken(newToken);
        setUser(getUserFromToken(newToken));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, register, logout }} // Provide user
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export {};
