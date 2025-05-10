import { z } from "@hono/zod-openapi";

export const LoginUserSchema = z.object({
	email: z.string().email().openapi({ example: "user1@example.com" }),
	password: z.string().min(6).openapi({ example: "12345678" }),
});

export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
