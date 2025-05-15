import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import { EventIsBookedError } from "@/common/errors/event-is-booked";
import { ResourceAlreadyExists } from "@/common/errors/resource-already-exists";
import { type DrizzlePgTransaction, TYPES } from "@/common/types";
import { Event } from "@/core/domain/entities/event";
import type {
	EventRepositoryPort,
	GetAllOptions,
} from "@/ports/output/repositories/event.repository.port";
import { desc, eq, sql } from "drizzle-orm";
import { inject, injectable } from "inversify";
import type { DrizzleDataSource } from "../../data-sources/drizzle/drizzle.data-source";
import { eventTable } from "../../data-sources/drizzle/schema";

@injectable()
export class EventDatabaseRepository implements EventRepositoryPort {
	db: DrizzleDataSource;

	constructor(@inject(TYPES.DrizzleDataSource) db: DrizzleDataSource) {
		this.db = db;
	}

	async getAll(options?: GetAllOptions): Promise<Event[]> {
		const category = options?.category;

		const events = await this.db.query.eventTable.findMany({
			orderBy: desc(eventTable.date),
			where: category ? (f, { eq }) => eq(f.category, category) : undefined,
		});

		return events.map(
			(event) =>
				new Event({
					eventId: event.eventId,
					eventName: event.eventName,
					description: event.description,
					category: event.category,
					date: event.date,
					venue: event.venue,
					price: event.price,
					image: event.image,
					availableTickets: event.availableTickets,
				}),
		);
	}

	async getById(eventId: number): Promise<Event | null> {
		const event = await this.db.query.eventTable.findFirst({
			where: (f, { eq }) => eq(f.eventId, eventId),
		});

		if (!event) {
			return null;
		}

		return new Event({
			eventId: event.eventId,
			eventName: event.eventName,
			description: event.description,
			category: event.category,
			date: event.date,
			venue: event.venue,
			price: event.price,
			image: event.image,
			availableTickets: event.availableTickets,
		});
	}

	async create(event: CreateEventDTO): Promise<Event> {
		const newEvent = await this.db
			.insert(eventTable)
			.values({
				eventName: event.eventName,
				description: event.description,
				category: event.category,
				date: event.date,
				venue: event.venue,
				price: event.price,
				image: event.image,
				availableTickets: event.availableTickets,
			})
			.returning();

		return new Event({
			eventId: newEvent[0].eventId,
			eventName: newEvent[0].eventName,
			description: newEvent[0].description,
			category: newEvent[0].category,
			date: newEvent[0].date,
			venue: newEvent[0].venue,
			price: newEvent[0].price,
			image: newEvent[0].image,
			availableTickets: newEvent[0].availableTickets,
		});
	}

	async update(
		eventId: number,
		updatedEventData: Event,
	): Promise<Event | null> {
		const eventDataForUpdate: Partial<typeof eventTable.$inferInsert> = {
			eventName: updatedEventData.eventName,
			description: updatedEventData.description,
			category: updatedEventData.category,
			date: updatedEventData.date,
			venue: updatedEventData.venue,
			price: updatedEventData.price,
			image: updatedEventData.image,
		};

		const updated = await this.db
			.update(eventTable)
			.set(eventDataForUpdate)
			.where(eq(eventTable.eventId, eventId))
			.returning();

		if (!updated[0]) {
			return null;
		}
		// After updating, fetch again to get current booking status
		return this.getById(updated[0].eventId);
	}

	async delete(eventId: number): Promise<Event | null> {
		const eventToDelete = await this.db.query.eventTable.findFirst({
			where: (f, { eq }) => eq(f.eventId, eventId),
			with: { bookings: true },
		});

		if (!eventToDelete) {
			return null;
		}

		if (eventToDelete.bookings.length > 0) {
			// Need to throw here because that's a critical error
			throw new EventIsBookedError(eventToDelete.eventId);
		}

		const deletedDbResult = await this.db
			.delete(eventTable)
			.where(eq(eventTable.eventId, eventId))
			.returning();

		if (!deletedDbResult[0]) {
			// This case should ideally not be reached if eventToDelete was found
			return null;
		}

		// Return the state of the event *before* it was deleted
		return new Event(eventToDelete);
	}

	async invalidateCache(eventId?: number): Promise<void> {
		return;
	}

	async decreaseTickets(
		eventId: number,
		transaction?: DrizzlePgTransaction,
	): Promise<void> {
		const db = transaction ?? this.db;

		await db
			.update(eventTable)
			.set({ availableTickets: sql`${eventTable.availableTickets} - 1` })
			.where(eq(eventTable.eventId, eventId));
	}

	async increaseTickets(
		eventId: number,
		transaction?: DrizzlePgTransaction,
	): Promise<void> {
		const db = transaction ?? this.db;

		await db
			.update(eventTable)
			.set({ availableTickets: sql`${eventTable.availableTickets} + 1` })
			.where(eq(eventTable.eventId, eventId));
	}
}
