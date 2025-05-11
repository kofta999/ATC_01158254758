import { sql } from "drizzle-orm";
import {
	date,
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";

export const userrole = pgEnum("userrole", ["USER", "ADMIN"]);

export const userTable = pgTable(
	"user",
	{
		userId: serial("user_id").primaryKey().notNull(),
		email: varchar().notNull(),
		password: varchar().notNull(),
		role: userrole().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [unique("user_email_key").on(table.email)],
);

export const eventTable = pgTable("event", {
	eventId: serial("event_id").primaryKey().notNull(),
	eventName: varchar("event_name").notNull(),
	description: varchar("description").notNull(),
	category: varchar("category").notNull(),
	date: date("date").notNull(),
	venue: varchar("venue").notNull(),
	price: integer("price").notNull(),
	image: varchar("image").notNull(),
});

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
