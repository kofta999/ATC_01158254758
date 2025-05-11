import type { BookingDetailsDTO } from "@/common/dtos/booking-details.dto";
import type { CreateBookingDTO } from "@/common/dtos/create-booking.dto";

export interface BookingApiPort {
	bookEvent(
		userId: number,
		booking: CreateBookingDTO,
	): Promise<BookingDetailsDTO>;
	removeBooking(userId: number, bookingId: number): Promise<BookingDetailsDTO>;
}
