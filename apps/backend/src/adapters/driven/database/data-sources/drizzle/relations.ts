import { relations } from "drizzle-orm";
import { bookingTable, eventTable, userTable } from "./schema";

export const userRelations = relations(userTable, ({ many }) => ({
	bookings: many(bookingTable),
}));

export const eventRelations = relations(eventTable, ({ many }) => ({
	bookings: many(bookingTable),
}));

export const bookingRelations = relations(bookingTable, ({ one, many }) => ({
	user: many(userTable),
	event: one(eventTable, {
		fields: [bookingTable.eventId],
		references: [eventTable.eventId],
	}),
}));
