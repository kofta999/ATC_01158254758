import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import type { EventDetailsDTO } from "@/common/dtos/event-details.dto";
import type { EventListDTO } from "@/common/dtos/event-list.dto";
import type { UpdateEventDTO } from "@/common/dtos/update-event.dto";
import type { EventCategory } from "@/core/domain/value-objects/event-category";

export type GetEventListOptions = {
	filter?: {
		category: EventCategory;
	};
	pagination: {
		page: number;
		limit: number;
	};
};

export interface EventApiPort {
	getEventDetails(eventId: number): Promise<EventDetailsDTO>;
	getEventList(options: GetEventListOptions): Promise<EventListDTO>;
	createEvent(eventDTO: CreateEventDTO): Promise<EventDetailsDTO>;
	updateEvent(
		eventId: number,
		updatedEventDTO: UpdateEventDTO,
	): Promise<EventDetailsDTO>;
	deleteEvent(eventId: number): Promise<EventDetailsDTO>;
}
