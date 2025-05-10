import env from './src/env';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

let config;

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

export default defineConfig({
  out: './src/adapters/driven/database/data-sources/drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {...config, ssl: false},
});
