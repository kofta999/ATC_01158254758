export const userRole = ["USER", "ADMIN"] as const;

export type UserRole = (typeof userRole)[number];
