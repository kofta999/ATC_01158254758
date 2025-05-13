import { type AppRouteHandler, TYPES } from "@/common/types";
import type { EventApiPort } from "@/ports/input/event.port";
import { put } from "@vercel/blob";
import { inject, injectable } from "inversify";
import type {
	CreateEventRoute,
	DeleteEventRoute,
	GetAllEventsRoute,
	GetEventByIdRoute,
	UpdateEventRoute,
} from "../routes/event.routes";

@injectable()
export class EventController {
	constructor(@inject(TYPES.EventApiPort) private eventService: EventApiPort) {}

	getAllEvents: AppRouteHandler<GetAllEventsRoute> = async (c) => {
		const events = await this.eventService.getEventList();
		return c.json(events, 200);
	};

	getEventById: AppRouteHandler<GetEventByIdRoute> = async (c) => {
		const { id } = c.req.valid("param");

		const event = await this.eventService.getEventDetails(id);

		return c.json(event, 200);
	};

	createEvent: AppRouteHandler<CreateEventRoute> = async (c) => {
		const eventData = c.req.valid("form");

		const blob = await put(eventData.imageFile.name, eventData.imageFile, {
			access: "public",
			addRandomSuffix: true,
		});

		const newEvent = await this.eventService.createEvent({
			...eventData,
			image: blob.url,
		});

		return c.json(newEvent, 201);
	};

	updateEvent: AppRouteHandler<UpdateEventRoute> = async (c) => {
		const { id } = c.req.valid("param");
		const eventData = c.req.valid("form");
		let image = undefined;

		if (eventData.imageFile) {
			const blob = await put(eventData.imageFile.name, eventData.imageFile, {
				access: "public",
				addRandomSuffix: true,
			});

			image = blob.url;
		}

		const updatedEvent = await this.eventService.updateEvent(id, {
			...eventData,
			image,
		});

		return c.json(updatedEvent, 200);
	};

	deleteEvent: AppRouteHandler<DeleteEventRoute> = async (c) => {
		const { id } = c.req.valid("param");

		const deletedEvent = await this.eventService.deleteEvent(id);

		return c.json(deletedEvent, 200);
	};
}
