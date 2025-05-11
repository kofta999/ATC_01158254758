import { z } from "@hono/zod-openapi";

export const BookingDetailsSchema = z
	.object({
		userId: z.number().openapi({ example: 1 }),
		eventId: z.number().openapi({ example: 1 }),
	})
	.openapi("BookingDetails");

export type BookingDetailsDTO = z.infer<typeof BookingDetailsSchema>;
