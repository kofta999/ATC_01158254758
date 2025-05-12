import { hcWithType } from "@repo/areeb-backend";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const baseApiClient = hcWithType(API_URL).api.v1;
