import type { userrole } from "@/adapters/driven/database/data-sources/drizzle/schema";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Env } from "hono";
import type { PinoLogger } from "hono-pino";

export type JwtAuthPayload = { userId: number; email: string; role: UserRole };

export interface AppBindings extends Env {
	Variables: {
		logger: PinoLogger;
		user: JwtAuthPayload;
	};
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;

export type Rating = number;

export type UserRole = (typeof userrole.enumValues)[number];

export const TYPES = {
	// Input Ports
	UserApiPort: Symbol.for("UserApiPort"),
	EventApiPort: Symbol.for("EventApiPort"),
	BookingApiPort: Symbol.for("BookingApiPort"),

	// Output Ports
	UserRepositoryPort: Symbol.for("UserRepositoryPort"),
	EventRepositoryPort: Symbol.for("EventRepositoryPort"),
	BookingRepositoryPort: Symbol.for("BookingRepositoryPort"),
	CachePort: Symbol.for("CachePort"),
	JwtPort: Symbol.for("JwtPort"),
	PasswordPort: Symbol.for("PasswordPort"),

	// Data Sources
	PostgresDataSource: Symbol.for("PostgresDataSource"),
	DrizzleDataSource: Symbol.for("DrizzleDataSource"),

	// Constants
	JWT_SECRET: Symbol.for("JWT_SECRET"),
};
