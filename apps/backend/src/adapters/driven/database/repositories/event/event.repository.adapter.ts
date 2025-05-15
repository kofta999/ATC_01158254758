import type { DrizzlePgTransaction } from "@/common/types";
import type { Event } from "@/core/domain/entities/event";
import type {
	EventRepositoryPort,
	GetAllOptions,
} from "@/ports/output/repositories/event.repository.port";
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

	getAll(options?: GetAllOptions): Promise<Event[]> {
		return this.repository.getAll(options);
	}

	invalidateCache(eventId?: number): Promise<void> {
		return this.repository.invalidateCache(eventId);
	}

	decreaseTickets(
		eventId: number,
		transaction?: DrizzlePgTransaction,
	): Promise<void> {
		return this.repository.decreaseTickets(eventId, transaction);
	}

	increaseTickets(
		eventId: number,
		transaction?: DrizzlePgTransaction,
	): Promise<void> {
		return this.repository.increaseTickets(eventId, transaction);
	}
}
