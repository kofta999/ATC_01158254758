import { relations } from "drizzle-orm/relations";
import { userTable, businessTable, reviewTable } from "./schema";

export const businessRelations = relations(businessTable, ({one, many}) => ({
	user: one(userTable, {
		fields: [businessTable.userId],
		references: [userTable.userId]
	}),
	reviews: many(reviewTable),
}));

export const userRelations = relations(userTable, ({many}) => ({
	businesses: many(businessTable),
}));

export const reviewRelations = relations(reviewTable, ({one}) => ({
	business: one(businessTable, {
		fields: [reviewTable.businessId],
		references: [businessTable.businessId]
	}),
}));