import * as React from "react";
import { router } from "@/main";
import { jwtDecode } from "jwt-decode";
import { hcWithType } from "@repo/areeb-backend";
import { baseApiClient } from "../base-api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Type Definition (remains the same)
type ApiClientInstanceType = typeof baseApiClient;

export interface User {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

// AuthContextType still defines the shape including apiClient
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string,
    role: "USER" | "ADMIN",
  ) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: (redirectToLogin?: boolean) => Promise<void>;
  token: string | null;
  apiClient: ApiClientInstanceType; // The type contract remains
}

const AuthContext = React.createContext<AuthContextType | null>(null);

const key = "auth.accessToken";

// getStoredToken, setStoredToken, getUserFromToken (remain the same)
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

function getUserFromToken(token: string | null): User | null {
  if (!token) return null;
  try {
    const decodedToken: {
      userId: string;
      email: string;
      role: "USER" | "ADMIN";
      exp: number;
    } = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      console.warn("Token expired.");
      setStoredToken(null);
      return null;
    }

    return {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    setStoredToken(null);
    return null;
  }
}

// Helper function to create the API client (remains mostly the same)
const createApiClientInstance = (
  apiBaseUrl: string,
  authToken: string | null,
  logoutHandler: (redirectToLogin?: boolean) => Promise<void>,
): ApiClientInstanceType => {
  const customFetch: typeof fetch = async (input, init) => {
    const currentHeaders = new Headers(init?.headers);
    if (authToken) {
      currentHeaders.set("Authorization", `Bearer ${authToken}`);
    }
    const response = await fetch(input, { ...init, headers: currentHeaders });
    if (response.status === 401 && authToken) {
      console.warn("API client (dynamic) returned 401. Logging out.");
      await logoutHandler(true);
      // Potentially throw to signal failure upstream
      // throw new Error("Unauthorized - Logged out");
    }
    return response;
  };

  const clientRoot = hcWithType(apiBaseUrl, { fetch: customFetch });

  if (clientRoot && clientRoot.api && clientRoot.api.v1) {
    return clientRoot.api.v1 as ApiClientInstanceType;
  } else {
    console.error(
      "Failed to create API client structure inside helper. Expected '.api.v1' but got:",
      clientRoot,
    );
    throw new Error(
      "API client initialization failed: Unexpected structure in helper.",
    );
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(getStoredToken());
  const [user, setUser] = React.useState<User | null>(() =>
    getUserFromToken(token),
  );
  const isAuthenticated = !!token && !!user;

  // Memoized logout function (remains the same)
  const performLogout = React.useCallback(async (redirectToLogin?: boolean) => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    if (redirectToLogin) {
      try {
        await router.navigate({ to: "/login" });
      } catch (error) {
        console.error("Failed to navigate on logout:", error);
        window.location.href = "/login";
      }
    }
  }, []);

  const login = React.useCallback(
    async (email: string, password: string, role: "USER" | "ADMIN") => {
      try {
        const response = await baseApiClient.auth.login.$post({
          json: { email, password, role },
        });

        if (!response.ok) {
          let errorMessage = "Login failed. Please check your credentials.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            /* ignore */
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const accessToken = data.token;

        setStoredToken(accessToken);
        const currentUser = getUserFromToken(accessToken); // Decode right away
        setToken(accessToken); // Set token state *after* decoding
        setUser(currentUser); // Update user state

        return !!currentUser;
      } catch (error: any) {
        console.error("Login failed:", error);
        alert(error.message || "An unknown error occurred during login.");
        await performLogout(false); // Clear state on failure
        return false;
      }
    },
    [performLogout],
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

  // Storage sync effect (remains the same)
  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        const newToken = event.newValue;
        const freshUser = getUserFromToken(newToken);
        setToken(newToken);
        setUser(freshUser);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // --- Create apiClient within the context value using useMemo ---
  const contextApiClient = React.useMemo(() => {
    console.log("Recreating apiClient for context value. Token:", !!token); // Debug log
    // Pass the current token and the stable performLogout function
    return createApiClientInstance(API_URL, token, performLogout);
    // Dependencies: Recreate only if token or the logout function instance changes
  }, [token, performLogout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        login,
        register,
        logout: performLogout,
        // Provide the memoized client created above
        apiClient: contextApiClient,
      }}
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
