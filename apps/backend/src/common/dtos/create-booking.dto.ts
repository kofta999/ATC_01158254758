import { z } from "@hono/zod-openapi";

export const CreateBookingSchema = z
	.object({
		eventId: z.number().openapi({ example: 1 }),
	})
	.openapi("CreateBooking");

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;
