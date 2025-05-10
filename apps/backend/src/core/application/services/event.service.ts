import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import type { EventDetailsDTO } from "@/common/dtos/event-details.dto";
import type { EventListDTO } from "@/common/dtos/event-list.dto";
import type { UpdateEventDTO } from "@/common/dtos/update-event.dto";
import { EventNotFoundError } from "@/common/errors/event-not-found";
import { TYPES } from "@/common/types";
import type { Event } from "@/core/domain/entities/event";
import type { EventApiPort } from "@/ports/input/event";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";
import { inject, injectable } from "inversify";

@injectable()
export class EventService implements EventApiPort {
	constructor(
		@inject(TYPES.EventRepositoryPort)
		private eventRepository: EventRepositoryPort,
	) {}

	getEventList(): Promise<EventListDTO> {
		return this.eventRepository.getAll();
	}

	async getEventDetails(eventId: number): Promise<EventDetailsDTO> {
		const maybeEvent = await this.eventRepository.getById(eventId);

		if (!maybeEvent) {
			throw new EventNotFoundError(eventId);
		}

		return maybeEvent;
	}

	async createEvent(eventDTO: CreateEventDTO): Promise<Event> {
		return this.eventRepository.create(eventDTO);
	}

	async updateEvent(
		eventId: number,
		updatedEventDTO: UpdateEventDTO,
	): Promise<EventDetailsDTO> {
		const maybeEvent = await this.eventRepository.update(
			eventId,
			updatedEventDTO,
		);

		if (!maybeEvent) {
			throw new EventNotFoundError(eventId);
		}

		return maybeEvent;
	}

	async deleteEvent(eventId: number): Promise<EventDetailsDTO> {
		const maybeEvent = await this.eventRepository.delete(eventId);

		if (!maybeEvent) {
			throw new EventNotFoundError(eventId);
		}

		return maybeEvent;
	}
}
