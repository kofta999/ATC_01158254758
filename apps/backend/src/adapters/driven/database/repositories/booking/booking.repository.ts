import type { Booking } from "@/core/domain/entities/booking";
import type { Event } from "@/core/domain/entities/event";
import type { BookingRepositoryPort } from "@/ports/output/repositories/booking.repository.port";
import { inject, injectable } from "inversify";
import { BookingDatabaseRepository } from "./booking.database.repository";

@injectable()
export class BookingRepositoryAdapter implements BookingRepositoryPort {
	constructor(
		@inject(BookingDatabaseRepository)
		private repository: BookingDatabaseRepository,
	) {}

	create(event: Booking): Promise<Booking> {
		return this.repository.create(event);
	}

	exists(eventId: number): Promise<boolean> {
		return this.repository.exists(eventId);
	}

	delete(userId: number, eventId: number): Promise<Booking | null> {
		return this.repository.delete(userId, eventId);
	}

	getAllForUser(
		userId: number,
	): Promise<{ booking: Booking; bookedEvent: Event }[]> {
		return this.repository.getAllForUser(userId);
	}
}
