import { z } from "zod";

export const RegisterUserSchema = z
	.object({
		email: z.string().email().openapi({ example: "user1@example.com" }),
		password: z.string().min(6).openapi({ example: "12345678" }),
	})
	.openapi("RegisterUser");

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
