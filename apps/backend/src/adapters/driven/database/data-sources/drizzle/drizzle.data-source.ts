import env from "@/env";
import { drizzle } from "drizzle-orm/node-postgres";
import type pg from "pg";
import * as relations from "./relations";
import * as schema from "./schema";

let config: pg.PoolConfig;

if (env.DATABASE_URL) {
	config = {
		connectionString: env.DATABASE_URL,

		ssl: {
			rejectUnauthorized: false,
		},
	};
} else {
	config = {
		port: env.PG_PORT,
		host: env.PG_HOST,
		user: env.PG_USER,
		password: env.PG_PASSWORD,
		database: env.PG_DB_NAME,
	};
}

export const db = drizzle({
	schema: { ...schema, ...relations },
	connection: config,
	logger: env.NODE_ENV === "development",
});

export type DrizzleDataSource = typeof db;
