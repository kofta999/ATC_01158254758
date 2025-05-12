import { z } from "@hono/zod-openapi";
import { EventDetailsSchema } from "./event-details.dto";

const BookingSchema = z
	.object({
		booking: z.object({
			bookingId: z.number().openapi({ example: 1 }),
			userId: z.number().openapi({ example: 1 }),
			eventId: z.number().openapi({ example: 1 }),
			createdAt: z.date().openapi({ example: "2024-07-20" }),
		}),
		bookedEvent: EventDetailsSchema,
	})
	.openapi("BookingDetails");

export const BookingListSchema = z.array(BookingSchema);

export type BookingListDTO = z.infer<typeof BookingListSchema>;
