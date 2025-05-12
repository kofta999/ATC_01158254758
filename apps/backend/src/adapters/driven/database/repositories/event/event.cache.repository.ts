import { TYPES } from "@/common/types";
import { Event } from "@/core/domain/entities/event";
import type { CachePort } from "@/ports/output/cache/cache.port";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";
import { inject, injectable } from "inversify";
import { EventDatabaseRepository } from "./event.database.repository";

@injectable()
export class EventCacheRepository implements EventRepositoryPort {
	private CACHE_KEY = "events" as const;

	constructor(
		@inject(EventDatabaseRepository)
		private repository: EventDatabaseRepository,
		@inject(TYPES.CachePort)
		private cache: CachePort,
	) {}

	create(event: Event): Promise<Event> {
		return this.repository.create(event);
	}

	async getById(eventId: number): Promise<Event | null> {
		const key = this.cache.generateKey(this.CACHE_KEY, eventId);
		const cached = await this.cache.get<Event>(key);

		if (cached) {
			return new Event(cached);
		}

		const event = this.repository.getById(eventId);

		this.cache.set(key, event);

		return event;
	}

	update(eventId: number, event: Event): Promise<Event | null> {
		this.cache.del(this.cache.generateKey(this.CACHE_KEY, eventId));
		return this.repository.update(eventId, event);
	}

	delete(eventId: number): Promise<Event | null> {
		this.cache.del(this.cache.generateKey(this.CACHE_KEY, eventId));
		return this.repository.delete(eventId);
	}

	async getAll(): Promise<Event[]> {
		const key = this.cache.generateKey(this.CACHE_KEY);
		const cached = await this.cache.get<Event[]>(key);

		if (cached) {
			return cached.map((ev) => new Event(ev));
		}

		const events = this.repository.getAll();

		this.cache.set(key, events);

		return events;
	}
}
