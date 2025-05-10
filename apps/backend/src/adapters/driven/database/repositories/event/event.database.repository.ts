import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import { TYPES } from "@/common/types";
import { Event } from "@/core/domain/entities/event";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";
import { eq } from "drizzle-orm";
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
		const events = await this.db.query.eventTable.findMany();

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
		});
	}

	async update(eventId: number, updatedEvent: Event): Promise<Event | null> {
		const updated = await this.db
			.update(eventTable)
			.set(updatedEvent)
			.where(eq(eventTable.eventId, eventId))
			.returning();
		if (!updated[0]) {
			return null;
		}
		const event = updated[0];
		return new Event({
			eventId: event.eventId,
			eventName: event.eventName,
			description: event.description,
			category: event.category,
			date: event.date,
			venue: event.venue,
			price: event.price,
			image: event.image,
		});
	}

	async delete(eventId: number): Promise<Event | null> {
		const deletedEvent = await this.db
			.delete(eventTable)
			.where(eq(eventTable.eventId, eventId))
			.returning();
		if (!deletedEvent[0]) {
			return null;
		}

		const event = deletedEvent[0];
		return new Event({
			eventId: event.eventId,
			eventName: event.eventName,
			description: event.description,
			category: event.category,
			date: event.date,
			venue: event.venue,
			price: event.price,
			image: event.image,
		});
	}
}
