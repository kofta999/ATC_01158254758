import { RedisCacheAdapter } from "@/adapters/driven/cache/redis-cache.adapter";
import {
	type DrizzleDataSource,
	db,
} from "@/adapters/driven/database/data-sources/drizzle/drizzle.data-source";
import { PostgresDataSource } from "@/adapters/driven/database/data-sources/postgres/postgres.data-source";
import { UserRepositoryAdapter } from "@/adapters/driven/database/repositories/user/user.repository.adapter";
import { BcryptPasswordAdapter } from "@/adapters/driven/security/bcrypt-password.adapter";
import { HonoJwtAdapter } from "@/adapters/driven/security/hono-jwt.adapter";
import { UserService } from "@/core/application/services/user.service";
import env from "@/env";
import type { UserApiPort } from "@/ports/input/user";
import type { CachePort } from "@/ports/output/cache/cache.port";
import type { UserRepositoryPort } from "@/ports/output/repositories/user.repository.port";
import type { JwtPort } from "@/ports/output/security/jwt.port";
import type { PasswordPort } from "@/ports/output/security/password.port";
import { Container } from "inversify";
import { TYPES } from "./types";

const mainContainer = new Container({ autobind: true });

// Database connection
mainContainer
	.bind<PostgresDataSource>(TYPES.PostgresDataSource)
	.to(PostgresDataSource)
	.inSingletonScope();

mainContainer
	.bind<DrizzleDataSource>(TYPES.DrizzleDataSource)
	.toConstantValue(db);

// Repositories
mainContainer
	.bind<UserRepositoryPort>(TYPES.UserRepositoryPort)
	.to(UserRepositoryAdapter);

// Services
mainContainer.bind<UserApiPort>(TYPES.UserApiPort).to(UserService);

// Common services
mainContainer
	.bind<CachePort>(TYPES.CachePort)
	.to(RedisCacheAdapter)
	.inSingletonScope();

mainContainer
	.bind<JwtPort>(TYPES.JwtPort)
	.to(HonoJwtAdapter)
	.inSingletonScope();

mainContainer
	.bind<PasswordPort>(TYPES.PasswordPort)
	.to(BcryptPasswordAdapter)
	.inSingletonScope();

// Constants
mainContainer.bind(TYPES.JWT_SECRET).toConstantValue(env.JWT_SECRET);

export { mainContainer };
