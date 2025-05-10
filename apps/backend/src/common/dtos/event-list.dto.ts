import { z } from "@hono/zod-openapi";

const EventCardSchema = z
	.object({
		eventId: z.number().openapi({ example: 1 }),
		eventName: z.string().openapi({ example: "Summer Music Festival" }),
		category: z.string().openapi({ example: "Music" }),
		date: z.string().openapi({ example: "2024-07-20" }),
		venue: z.string().openapi({ example: "Central Park, New York" }),
		image: z.string().openapi({ example: "url-to-image" }),
	})
	.openapi("EventCard");

export const EventListSchema = z.array(EventCardSchema).openapi("EventList");

export type EventListDTO = z.infer<typeof EventListSchema>;
