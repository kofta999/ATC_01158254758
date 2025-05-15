import type { Event } from "@/core/domain/entities/event";
import type { EventCategory } from "@/core/domain/value-objects/event-category";

export type GetAllOptions = {
	category?: EventCategory;
};

export interface EventRepositoryPort {
	getAll(options?: GetAllOptions): Promise<Event[]>;
	getById(eventId: number): Promise<Event | null>;
	create(event: Omit<Event, "eventId" | "isBooked">): Promise<Event>;
	update(eventId: number, updatedEvent: Partial<Event>): Promise<Event | null>;
	delete(eventId: number): Promise<Event | null>;
	invalidateCache(eventId?: number): Promise<void>;
}
