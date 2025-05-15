import { eventCategories } from "@/core/domain/value-objects/event-category";
import { userRole } from "@/core/domain/value-objects/user-role";
import { sql } from "drizzle-orm";
import {
	check,
	date,
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";

export const eventCategoryEnum = pgEnum("event_category", eventCategories);

export const userRoleEnum = pgEnum("userrole", userRole);

export const userTable = pgTable(
	"user",
	{
		userId: serial("user_id").primaryKey().notNull(),
		email: varchar().notNull(),
		password: varchar().notNull(),
		role: userRoleEnum().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [unique("user_email_key").on(table.email)],
);

export const eventTable = pgTable(
	"event",
	{
		eventId: serial("event_id").primaryKey().notNull(),
		eventName: varchar("event_name").notNull(),
		description: varchar("description").notNull(),
		category: eventCategoryEnum("category").notNull(),
		date: date("date").notNull(),
		venue: varchar("venue").notNull(),
		price: integer("price").notNull(),
		image: varchar("image").notNull(),
		availableTickets: integer("available_tickets").notNull(),
	},
	(table) => [
		check("available_tickets_check", sql`${table.availableTickets} >= 0`),
	],
);

export const bookingTable = pgTable(
	"booking",
	{
		bookingId: serial("booking_id").primaryKey().notNull(),
		userId: integer("user_id")
			.notNull()
			.references(() => userTable.userId),
		eventId: integer("event_id")
			.notNull()
			.references(() => eventTable.eventId),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => {
		return {
			userIdEventIdUnique: unique("user_id_event_id_unique").on(
				table.userId,
				table.eventId,
			),
		};
	},
);
