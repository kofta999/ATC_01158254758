import { eventCategories } from "@/core/domain/value-objects/event-category";
import { z } from "@hono/zod-openapi";

export const UpdateEventSchema = z
	.object({
		eventName: z
			.string()
			.optional()
			.openapi({ example: "Summer Music Festival" }),
		description: z
			.string()
			.optional()
			.openapi({ example: "A vibrant music festival featuring top artists." }),
		category: z.enum(eventCategories).optional().openapi({ example: "Music" }),
		date: z.string().optional().openapi({ example: "2024-07-20" }),
		venue: z.string().optional().openapi({ example: "Central Park, New York" }),
		price: z.coerce.number().optional().openapi({ example: 50 }),
	})
	.openapi("UpdateEvent");

export type UpdateEventDTO = z.infer<typeof UpdateEventSchema> & {
	image?: string;
};
