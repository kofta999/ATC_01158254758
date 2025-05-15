import type { DrizzleDataSource } from "@/adapters/driven/database/data-sources/drizzle/drizzle.data-source";
import type { BookingDetailsDTO } from "@/common/dtos/booking-details.dto";
import type { BookingListDTO } from "@/common/dtos/bookings-list.dto";
import type { CreateBookingDTO } from "@/common/dtos/create-booking.dto";
import { EventIsBookedError } from "@/common/errors/event-is-booked";
import { ResourceAlreadyExists } from "@/common/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/common/errors/resource-not-found";
import { TYPES } from "@/common/types";
import type { BookingApiPort } from "@/ports/input/booking.port";
import type { BookingRepositoryPort } from "@/ports/output/repositories/booking.repository.port";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";
import { inject, injectable } from "inversify";

@injectable()
export class BookingService implements BookingApiPort {
	constructor(
		@inject(TYPES.BookingRepositoryPort)
		private bookingRepository: BookingRepositoryPort,
		@inject(TYPES.EventRepositoryPort)
		private eventRepository: EventRepositoryPort,
		@inject(TYPES.DrizzleDataSource)
		private drizzle: DrizzleDataSource,
	) {}

	async bookEvent(
		userId: number,
		booking: CreateBookingDTO,
	): Promise<BookingDetailsDTO> {
		const isBookingExists = await this.bookingRepository.exists(
			userId,
			booking.eventId,
		);

		if (isBookingExists) {
			throw new ResourceAlreadyExists("Booking");
		}

		const event = await this.eventRepository.getById(booking.eventId);

		if (!event) {
			throw new ResourceNotFoundError("Event", booking.eventId);
		}

		if (event.availableTickets <= 0) {
			throw new EventIsBookedError(event.eventId);
		}

		const newBooking = await this.drizzle.transaction(async (tx) => {
			await this.eventRepository.decreaseTickets(booking.eventId, tx);

			const newBooking = await this.bookingRepository.create(
				{
					userId,
					...booking,
				},
				tx,
			);

			return newBooking;
		});

		await this.eventRepository.invalidateCache();
		await this.eventRepository.invalidateCache(newBooking.eventId);

		return newBooking;
	}

	async removeBooking(
		userId: number,
		bookingId: number,
	): Promise<BookingDetailsDTO> {
		const maybeBooking = await this.drizzle.transaction(async (tx) => {
			const maybeBooking = await this.bookingRepository.delete(
				userId,
				bookingId,
				tx,
			);

			if (!maybeBooking) {
				throw new ResourceNotFoundError("Booking", bookingId);
			}

			this.eventRepository.increaseTickets(maybeBooking.eventId, tx);

			return maybeBooking;
		});

		await this.eventRepository.invalidateCache();
		await this.eventRepository.invalidateCache(maybeBooking.eventId);
		return maybeBooking;
	}

	async getBookings(userId: number): Promise<BookingListDTO> {
		const bookings = await this.bookingRepository.getAllForUser(userId);

		return bookings;
	}
}
