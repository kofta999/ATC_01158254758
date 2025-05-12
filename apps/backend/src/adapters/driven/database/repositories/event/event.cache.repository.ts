import { TYPES } from "@/common/types";
import { Event } from "@/core/domain/entities/event";
import type { CachePort } from "@/ports/output/cache/cache.port";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";
import { inject, injectable } from "inversify";
import { EventDatabaseRepository } from "./event.database.repository";

@injectable()
export class EventCacheRepository implements EventRepositoryPort {
	private readonly CACHE_KEY_PREFIX = "events" as const;

	constructor(
		@inject(EventDatabaseRepository)
		private repository: EventDatabaseRepository,
		@inject(TYPES.CachePort)
		private cache: CachePort,
	) {}

	private getEventCacheKey(eventId: number | string): string {
		return this.cache.generateKey(this.CACHE_KEY_PREFIX, String(eventId));
	}

	private getAllEventsCacheKey() {
		return this.cache.generateKey(this.CACHE_KEY_PREFIX, "all");
	}

	async create(eventData: Omit<Event, "eventId" | "isBooked">): Promise<Event> {
		await this.cache.del(this.getAllEventsCacheKey());

		const newEvent = await this.repository.create(eventData);

		return newEvent;
	}

	async getById(eventId: number): Promise<Event | null> {
		const key = this.getEventCacheKey(eventId);
		const cached = await this.cache.get<Event>(key);

		if (cached) {
			return new Event(cached);
		}

		const event = await this.repository.getById(eventId);

		if (event) {
			await this.cache.set(key, event);
		}
		return event;
	}

	async update(eventId: number, eventData: Event): Promise<Event | null> {
		await this.cache.del(this.getEventCacheKey(eventId));
		await this.cache.del(this.getAllEventsCacheKey());

		const updatedEvent = await this.repository.update(eventId, eventData);

		return updatedEvent;
	}

	async delete(eventId: number): Promise<Event | null> {
		const eventToDelete = await this.repository.delete(eventId);

		if (eventToDelete) {
			await this.cache.del(this.getEventCacheKey(eventId));
			await this.cache.del(this.getAllEventsCacheKey());
		}

		return eventToDelete;
	}

	async getAll(): Promise<Event[]> {
		const cached = await this.cache.get<Event[]>(this.getAllEventsCacheKey());

		if (cached && cached.length > 0) {
			return cached.map((ev) => new Event(ev));
		}

		const events = await this.repository.getAll();
		await this.cache.set(this.getAllEventsCacheKey(), events);
		return events;
	}
}
