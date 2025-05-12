import { LoginUserSchema } from "@/common/dtos/login-user.dto";
import { RegisterUserSchema } from "@/common/dtos/register-user.dto";
import { ErrorSchema } from "@/common/schemas/error-schema";
import jsonContent from "@/common/util/json-content";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const tags = ["Authentication"];

export const login = createRoute({
	path: "/login",
	method: "post",
	tags,
	summary: "Login",
	request: {
		body: jsonContent(LoginUserSchema, "Logging in user's data"),
	},
	responses: {
		200: jsonContent(
			z.object({
				token: z.string(),
			}),
			"The JWT token",
		),
		401: jsonContent(ErrorSchema, "Invalid credentials"),
	},
});

export type LoginRoute = typeof login;

export const register = createRoute({
	path: "/register",
	method: "post",
	tags,
	summary: "Register",
	request: {
		body: jsonContent(RegisterUserSchema, "Registering user's data"),
	},
	responses: {
		200: jsonContent(
			z.object({
				userId: z.number(),
			}),
			"The user ID",
		),
		409: jsonContent(ErrorSchema, "User already exists"),
	},
});

export type RegisterRoute = typeof register;
