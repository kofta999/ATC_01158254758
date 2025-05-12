import type { Event } from "@/core/domain/entities/event";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";
import { inject, injectable } from "inversify";
import { EventCacheRepository } from "./event.cache.repository";

@injectable()
export class EventRepositoryAdapter implements EventRepositoryPort {
	constructor(
		@inject(EventCacheRepository)
		private repository: EventCacheRepository,
	) {}

	create(event: Event): Promise<Event> {
		return this.repository.create(event);
	}

	getById(eventId: number): Promise<Event | null> {
		return this.repository.getById(eventId);
	}

	update(eventId: number, event: Event): Promise<Event | null> {
		return this.repository.update(eventId, event);
	}

	delete(eventId: number): Promise<Event | null> {
		return this.repository.delete(eventId);
	}

	getAll(): Promise<Event[]> {
		return this.repository.getAll();
	}
}
