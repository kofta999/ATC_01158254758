import type { Event } from "@/core/domain/entities/event";

export interface EventRepositoryPort {
	getAll(): Promise<Event[]>;
	getById(eventId: number): Promise<Event | null>;
	create(event: Omit<Event, "eventId">): Promise<Event>;
	update(eventId: number, updatedEvent: Partial<Event>): Promise<Event | null>;
	delete(eventId: number): Promise<Event | null>;
}
