import { hcWithType } from "@repo/areeb-backend";
import { useAuth } from "./use-auth";
import { useCallback } from "react";

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
type CustomFetch = typeof fetch;

export const useApiClient = () => {
  const { isAuthenticated, token, logout } = useAuth();

  const getApiClient = useCallback(() => {
    const headers: Record<string, string> = {};

    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const customFetch: CustomFetch = async (input, init) => {
      const response = await fetch(input, init);
      if (response.status === 401) {
        // Only logout if a token was actually used for this request.
        // This prevents logging out on public routes that might misuse 401,
        // or if no token was available to begin with.
        const headers = new Headers(init?.headers);
        if (init?.headers && headers.get("authorization")) {
          console.warn(
            "API returned 401 for an authenticated request, logging out.",
          );
          await logout(true);
        }
      }
      return response;
    };

    const fetchOptions = { headers, fetch: customFetch };

    return hcWithType(API_URL, fetchOptions).api.v1;
  }, [isAuthenticated, token, logout]); // Added logout to dependency array

  return getApiClient;
};

export const baseApiClient = hcWithType(API_URL).api.v1;
