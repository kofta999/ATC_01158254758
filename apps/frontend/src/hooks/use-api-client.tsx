import { hcWithType } from "@repo/areeb-backend";
import { useAuth } from "./use-auth";
import { useCallback } from "react";

export const useApiClient = () => {
  const { isAuthenticated, token } = useAuth();

  const getApiClient = useCallback(() => {
    const headers: Record<string, string> = {};

    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return hcWithType("http://localhost:3000", { headers }).api.v1;
  }, [isAuthenticated, token]);

  return getApiClient;
};

export const baseApiClient = hcWithType("http://localhost:3000").api.v1;
