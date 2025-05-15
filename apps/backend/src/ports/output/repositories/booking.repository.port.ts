import type { DrizzlePgTransaction } from "@/common/types";
import type { Booking } from "@/core/domain/entities/booking";
import type { Event } from "@/core/domain/entities/event";

export interface BookingRepositoryPort {
	getAllForUser(
		userId: number,
	): Promise<{ booking: Booking; bookedEvent: Event }[]>;
	exists(userId: number, eventId: number): Promise<boolean>;
	create(
		booking: Omit<Booking, "bookingId" | "createdAt">,
		transaction?: DrizzlePgTransaction,
	): Promise<Booking>;
	delete(
		userId: number,
		bookingId: number,
		transaction?: DrizzlePgTransaction,
	): Promise<Booking | null>;
}
