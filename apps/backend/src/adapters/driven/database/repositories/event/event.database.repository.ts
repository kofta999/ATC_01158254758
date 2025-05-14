import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import { ResourceAlreadyExists } from "@/common/errors/resource-already-exists";
import { TYPES } from "@/common/types";
import { Event } from "@/core/domain/entities/event";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";
import { desc, eq } from "drizzle-orm";
import { inject, injectable } from "inversify";
import type { DrizzleDataSource } from "../../data-sources/drizzle/drizzle.data-source";
import { eventTable } from "../../data-sources/drizzle/schema";

@injectable()
export class EventDatabaseRepository implements EventRepositoryPort {
	db: DrizzleDataSource;

	constructor(@inject(TYPES.DrizzleDataSource) db: DrizzleDataSource) {
		this.db = db;
	}

	async getAll(): Promise<Event[]> {
		const events = await this.db.query.eventTable.findMany({
			with: { bookings: true },
			orderBy: desc(eventTable.date),
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
					isBooked: event.bookings.length > 0,
				}),
		);
	}

	async getById(eventId: number): Promise<Event | null> {
		const event = await this.db.query.eventTable.findFirst({
			where: (f, { eq }) => eq(f.eventId, eventId),
			with: { bookings: true },
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
			isBooked: event.bookings.length > 0,
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
			isBooked: false, // A new event cannot be booked yet
		});
	}

	async update(
		eventId: number,
		updatedEventData: Event,
	): Promise<Event | null> {
		// Create a partial object for update, excluding 'isBooked' as it's derived
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
		// Fetch the event first to return its state before deletion, including isBooked.
		const eventToDelete = await this.getById(eventId);
		if (!eventToDelete) {
			return null;
		}

		if (eventToDelete.isBooked) {
			return eventToDelete;
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
		return eventToDelete;
	}

	async invalidateCache(eventId?: number): Promise<void> {
		return;
	}
}
