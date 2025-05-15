import { eventCategories } from "@/core/domain/value-objects/event-category";
import { z } from "@hono/zod-openapi";

export const EventDetailsSchema = z
	.object({
		eventId: z.number().openapi({ example: 1 }),
		eventName: z.string().openapi({ example: "Summer Music Festival" }),
		description: z
			.string()
			.openapi({ example: "A vibrant music festival featuring top artists." }),
		category: z.enum(eventCategories).openapi({ example: "Music" }),
		date: z.string().openapi({ example: "2024-07-20" }),
		venue: z.string().openapi({ example: "Central Park, New York" }),
		price: z.number().openapi({ example: 50 }),
		image: z.string().openapi({ example: "url-to-image" }),
		availableTickets: z.coerce.number().openapi({ example: 100 }),
	})
	.openapi("EventDetails");

export type EventDetailsDTO = z.infer<typeof EventDetailsSchema>;
