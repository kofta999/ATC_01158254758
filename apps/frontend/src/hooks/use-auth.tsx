import * as React from "react";
import { baseApiClient } from "./use-api-client";
import { router } from "@/main";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    role: "USER" | "ADMIN",
  ) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: (redirectToLogin: boolean) => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(getStoredToken());
  const isAuthenticated = !!token;

  const logout = React.useCallback(async (redirectToLogin?: boolean) => {
    setStoredToken(null);
    setToken(null);

    if (redirectToLogin) {
      router.navigate({ to: "/login" });
    }
  }, []);

  const login = React.useCallback(
    async (email: string, password: string, role: "USER" | "ADMIN") => {
      try {
        const response = await baseApiClient.auth.login.$post({
          json: { email, password, role },
        });

        if (!response.ok) {
          throw new Error("Server error");
        }

        const data = await response.json();
        const accessToken = data.token;
        setStoredToken(accessToken);
        setToken(accessToken);
        return true;
      } catch (error: any) {
        console.error("Login failed:", error.message);
        alert(error.message);
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
          throw new Error("Server error");
        }
        return true;
      } catch (error: any) {
        console.error("Registration failed:", error.message);
        alert(error.message);
        return false;
      }
    },
    [],
  );

  React.useEffect(() => {
    setToken(getStoredToken());
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, register, logout }}
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
