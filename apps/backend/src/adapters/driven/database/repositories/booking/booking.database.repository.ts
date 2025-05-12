import type { BookingDetailsDTO } from "@/common/dtos/booking-details.dto";
import { TYPES } from "@/common/types";
import { Booking } from "@/core/domain/entities/booking";
import { Event } from "@/core/domain/entities/event";
import type { BookingRepositoryPort } from "@/ports/output/repositories/booking.repository.port";
import { and, eq } from "drizzle-orm";
import { inject, injectable } from "inversify";
import type { DrizzleDataSource } from "../../data-sources/drizzle/drizzle.data-source";
import { bookingTable } from "../../data-sources/drizzle/schema";

@injectable()
export class BookingDatabaseRepository implements BookingRepositoryPort {
	db: DrizzleDataSource;

	constructor(@inject(TYPES.DrizzleDataSource) db: DrizzleDataSource) {
		this.db = db;
	}
	async getAllForUser(
		userId: number,
	): Promise<{ booking: Booking; bookedEvent: Event }[]> {
		const bookings = await this.db.query.bookingTable.findMany({
			where: (f, { eq }) => eq(f.userId, userId),
			with: { event: true },
		});

		return bookings.map((booking) => ({
			booking: new Booking({
				bookingId: booking.bookingId,
				userId: booking.userId,
				eventId: booking.eventId,
				createdAt: new Date(booking.createdAt),
			}),
			bookedEvent: new Event({ ...booking.event, isBooked: true }),
		}));
	}

	async exists(eventId: number): Promise<boolean> {
		const booking = await this.db.query.bookingTable.findFirst({
			where: (f, { eq }) => eq(f.eventId, eventId),
		});
		return !!booking;
	}

	async create(booking: Omit<Booking, "bookingId">): Promise<Booking> {
		const newBooking = await this.db
			.insert(bookingTable)
			.values({
				userId: booking.userId,
				eventId: booking.eventId,
			})
			.returning();

		return new Booking({
			bookingId: newBooking[0].bookingId,
			userId: newBooking[0].userId,
			eventId: newBooking[0].eventId,
			createdAt: new Date(newBooking[0].createdAt),
		});
	}

	async delete(userId: number, bookingId: number): Promise<Booking | null> {
		const deletedBooking = await this.db
			.delete(bookingTable)
			.where(
				and(
					eq(bookingTable.userId, userId),
					eq(bookingTable.bookingId, bookingId),
				),
			)
			.returning();

		if (!deletedBooking[0]) {
			return null;
		}

		const booking = deletedBooking[0];
		return new Booking({
			bookingId: booking.bookingId,
			userId: booking.userId,
			eventId: booking.eventId,
			createdAt: new Date(booking.createdAt),
		});
	}
}
