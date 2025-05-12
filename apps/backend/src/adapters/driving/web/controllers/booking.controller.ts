import { type AppRouteHandler, TYPES } from "@/common/types";
import type { BookingApiPort } from "@/ports/input/booking.port";
import { inject, injectable } from "inversify";
import type {
	CreateBookingRoute,
	DeleteBookingRoute,
	GetBookingsRoute,
} from "../routes/booking.routes";

@injectable()
export class BookingController {
	constructor(
		@inject(TYPES.BookingApiPort) private bookingService: BookingApiPort,
	) {}

	createBooking: AppRouteHandler<CreateBookingRoute> = async (c) => {
		const bookingData = c.req.valid("json");
		const user = c.var.user;

		const newBooking = await this.bookingService.bookEvent(
			user.userId,
			bookingData,
		);

		return c.json(newBooking, 201);
	};

	deleteBooking: AppRouteHandler<DeleteBookingRoute> = async (c) => {
		const { id } = c.req.valid("param");
		const user = c.var.user;

		const deletedBooking = await this.bookingService.removeBooking(
			user.userId,
			id,
		);

		return c.json(deletedBooking, 200);
	};

	getBookings: AppRouteHandler<GetBookingsRoute> = async (c) => {
		const user = c.var.user;

		const bookings = await this.bookingService.getBookings(user.userId);

		return c.json(bookings, 200);
	};
}
