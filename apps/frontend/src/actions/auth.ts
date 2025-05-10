import { apiClient } from "@/api-client";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";

export const LoginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const RegisterUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function loginUser(form: FormData) {
	const res = LoginUserSchema.safeParse(Object.fromEntries(form));

	if (!res.success) {
		throw new Error("Invalid input");
	}

	const response = await apiClient.auth.login.$post({ json: res.data });

	if (!response.ok) {
		throw new Error("Server error");
	}

	redirect({ to: "/" });
}

export async function registerUser(form: FormData) {
	const res = RegisterUserSchema.safeParse(Object.fromEntries(form));

	if (!res.success) {
		throw new Error("Invalid input");
	}

	const response = await apiClient.auth.register.$post({
		json: res.data,
	});

	if (!response.ok) {
		throw new Error("Server error");
	}

	console.log(await response.json());

	return redirect({ to: "/login" });
}
