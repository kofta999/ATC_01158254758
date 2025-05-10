import { z } from "@hono/zod-openapi";

export const CreateEventSchema = z
	.object({
		eventName: z.string().openapi({ example: "Summer Music Festival" }),
		description: z
			.string()
			.openapi({ example: "A vibrant music festival featuring top artists." }),
		category: z.string().openapi({ example: "Music" }),
		date: z.string().openapi({ example: "2024-07-20" }),
		venue: z.string().openapi({ example: "Central Park, New York" }),
		price: z.number().openapi({ example: 50 }),
		image: z.string().openapi({ example: "url-to-image" }),
	})
	.openapi("CreateEvent");

export type CreateEventDTO = z.infer<typeof CreateEventSchema>;
