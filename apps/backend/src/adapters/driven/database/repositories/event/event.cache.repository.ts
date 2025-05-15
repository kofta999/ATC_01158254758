import { type DrizzlePgTransaction, TYPES } from "@/common/types";
import { Event } from "@/core/domain/entities/event";
import type { CachePort } from "@/ports/output/cache/cache.port";
import type {
	EventRepositoryPort,
	GetAllOptions,
} from "@/ports/output/repositories/event.repository.port";
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
		return this.cache.generateKey(this.CACHE_KEY_PREFIX, "all*");
	}

	async create(eventData: Omit<Event, "eventId" | "isBooked">): Promise<Event> {
		await this.invalidateCache();

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
		const updatedEvent = await this.repository.update(eventId, eventData);

		if (updatedEvent) {
			await this.invalidateCache(eventId);
			await this.invalidateCache();
		}

		return updatedEvent;
	}

	async delete(eventId: number): Promise<Event | null> {
		const eventToDelete = await this.repository.delete(eventId);

		if (eventToDelete) {
			await this.invalidateCache(eventId);
			await this.invalidateCache();
		}

		return eventToDelete;
	}

	async getAll(options?: GetAllOptions): Promise<Event[]> {
		const key = options?.category
			? this.cache.generateKey(this.CACHE_KEY_PREFIX, "all", options.category)
			: this.cache.generateKey(this.CACHE_KEY_PREFIX, "all");

		const cached = await this.cache.get<Event[]>(key);

		if (cached && cached.length > 0) {
			return cached.map((ev) => new Event(ev));
		}

		const events = await this.repository.getAll(options);

		await this.cache.set(key, events);

		return events;
	}

	invalidateCache(eventId?: number): Promise<void> {
		return eventId
			? this.cache.del(this.getEventCacheKey(eventId))
			: this.cache.delByPattern(this.getAllEventsCacheKey());
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
