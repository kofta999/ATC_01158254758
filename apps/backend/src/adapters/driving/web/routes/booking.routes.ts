import { BookingDetailsSchema } from "@/common/dtos/booking-details.dto";
import { CreateBookingSchema } from "@/common/dtos/create-booking.dto";
import { ErrorSchema } from "@/common/schemas/error-schema";
import { IdSchema } from "@/common/schemas/id-schema";
import jsonContent from "@/common/util/json-content";
import { createRoute } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/require-role.middleware";

const tags = ["Bookings"];

export const createBooking = createRoute({
	path: "/",
	method: "post",
	middleware: [authMiddleware, requireRole("USER")] as const,
	tags,
	summary: "Book Event",
	request: {
		body: jsonContent(CreateBookingSchema, "Booking data"),
	},
	responses: {
		201: jsonContent(BookingDetailsSchema, "Created booking"),
		// TODO: Add 422 errors
	},
});

export type CreateBookingRoute = typeof createBooking;

export const deleteBooking = createRoute({
	path: "/{id}",
	method: "delete",
	tags,
	middleware: [authMiddleware, requireRole("USER")] as const,
	summary: "Remove Booking",
	request: {
		params: IdSchema,
	},
	responses: {
		200: jsonContent(BookingDetailsSchema, "Deleted booking"),
		404: jsonContent(ErrorSchema, "Booking not found"),
	},
});

export type DeleteBookingRoute = typeof deleteBooking;
