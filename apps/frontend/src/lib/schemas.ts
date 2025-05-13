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

const EventCardSchema = z.object({
	eventId: z.number(),
	eventName: z.string(),
	category: z.string(),
	date: z.string(),
	venue: z.string(),
	image: z.string(),
});

export const EventListSchema = z.array(EventCardSchema);
