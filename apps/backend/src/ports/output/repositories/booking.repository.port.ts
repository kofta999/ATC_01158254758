import type { Booking } from "@/core/domain/entities/booking";
import type { Event } from "@/core/domain/entities/event";

export interface BookingRepositoryPort {
	getAllForUser(
		userId: number,
	): Promise<{ booking: Booking; bookedEvent: Event }[]>;
	exists(eventId: number): Promise<boolean>;
	create(booking: Omit<Booking, "bookingId" | "createdAt">): Promise<Booking>;
	delete(userId: number, bookingId: number): Promise<Booking | null>;
}
