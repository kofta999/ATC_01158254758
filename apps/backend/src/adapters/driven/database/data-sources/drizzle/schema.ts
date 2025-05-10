import { sql } from "drizzle-orm";
import {
	check,
	foreignKey,
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";

export const userrole = pgEnum("userrole", ["BUSINESS", "REVIEWER", "ADMIN"]);

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

export const businessTable = pgTable(
	"business",
	{
		businessId: serial("business_id").primaryKey().notNull(),
		userId: integer("user_id").notNull(),
		name: varchar().notNull(),
		description: varchar().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [userTable.userId],
			name: "business_user_id_fkey",
		}).onDelete("cascade"),
	],
);

export const reviewTable = pgTable(
	"review",
	{
		reviewId: serial("review_id").primaryKey().notNull(),
		businessId: integer("business_id").notNull(),
		rating: integer().notNull(),
		title: varchar().notNull(),
		description: varchar().notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.businessId],
			foreignColumns: [businessTable.businessId],
			name: "review_business_id_fkey",
		}).onDelete("cascade"),
		check("review_rating_check", sql`(rating >= 1) AND (rating <= 5)`),
	],
);
