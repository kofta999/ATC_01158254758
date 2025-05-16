import type { DrizzlePgTransaction } from "@/common/types";
import type { Event } from "@/core/domain/entities/event";
import type { EventCategory } from "@/core/domain/value-objects/event-category";

export type GetAllOptions = {
	category?: EventCategory;
	offset: number;
	limit: number;
};

export interface EventRepositoryPort {
	getAll(options: GetAllOptions): Promise<Event[]>;
	count(options: GetAllOptions): Promise<number>;
	getById(eventId: number): Promise<Event | null>;
	create(event: Omit<Event, "eventId">): Promise<Event>;
	update(eventId: number, updatedEvent: Partial<Event>): Promise<Event | null>;
	delete(eventId: number): Promise<Event | null>;
	decreaseTickets(
		eventId: number,
		transaction?: DrizzlePgTransaction,
	): Promise<void>;
	increaseTickets(
		eventId: number,
		transaction?: DrizzlePgTransaction,
	): Promise<void>;
	invalidateCache(eventId?: number): Promise<void>;
}
