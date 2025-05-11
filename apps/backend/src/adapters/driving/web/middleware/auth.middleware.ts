import { HonoJwtAdapter } from "@/adapters/driven/security/hono-jwt.adapter";
import { UnauthorizedError } from "@/common/errors/unauthorized";
import { mainContainer } from "@/common/ioc";
import type { AppBindings, JwtAuthPayload, UserRole } from "@/common/types";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
	const jwtService = mainContainer.get(HonoJwtAdapter<JwtAuthPayload>);
	const header = c.req.header("Authorization");

	if (!header) {
		throw new UnauthorizedError();
	}

	const tokenString = header.substring(7);

	try {
		const payload = await jwtService.verify(tokenString);
		c.set("user", payload);
		await next();
	} catch (error) {
		throw new UnauthorizedError();
	}
});
