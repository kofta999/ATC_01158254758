import { z } from "zod";
import { zfd } from "zod-form-data";

export const LoginUserSchema = zfd.formData({
	email: zfd.text(z.string().email()),
	password: zfd.text(z.string().min(6)),
});

export const RegisterUserSchema = zfd.formData({
	email: zfd.text(z.string().email()),
	password: zfd.text(z.string().min(6)),
});
