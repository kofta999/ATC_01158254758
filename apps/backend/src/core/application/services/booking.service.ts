import type { BookingDetailsDTO } from "@/common/dtos/booking-details.dto";
import type { BookingListDTO } from "@/common/dtos/bookings-list.dto";
import type { CreateBookingDTO } from "@/common/dtos/create-booking.dto";
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
	) {}

	async bookEvent(
		userId: number,
		booking: CreateBookingDTO,
	): Promise<BookingDetailsDTO> {
		const isBookingExists = await this.bookingRepository.exists(
			booking.eventId,
		);

		if (isBookingExists) {
			throw new ResourceAlreadyExists("Booking");
		}

		const newBooking = await this.bookingRepository.create({
			userId,
			...booking,
		});

		await this.eventRepository.invalidateCache();
		await this.eventRepository.invalidateCache(newBooking.eventId);

		return newBooking;
	}

	async removeBooking(
		userId: number,
		bookingId: number,
	): Promise<BookingDetailsDTO> {
		const maybeBooking = await this.bookingRepository.delete(userId, bookingId);

		if (!maybeBooking) {
			throw new ResourceNotFoundError("Booking", bookingId);
		}

		await this.eventRepository.invalidateCache();
		await this.eventRepository.invalidateCache(maybeBooking.eventId);
		return maybeBooking;
	}

	async getBookings(userId: number): Promise<BookingListDTO> {
		const bookings = await this.bookingRepository.getAllForUser(userId);

		return bookings;
	}
}
