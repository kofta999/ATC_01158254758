import type { Booking } from "@/core/domain/entities/booking";

export interface BookingRepositoryPort {
	getAllForUser(userId: number): Promise<Booking[]>;
	exists(eventId: number): Promise<boolean>;
	create(booking: Omit<Booking, "bookingId" | "createdAt">): Promise<Booking>;
	delete(userId: number, bookingId: number): Promise<Booking | null>;
}
