import { type AppRouteHandler, TYPES } from "@/common/types";
import type { UserApiPort } from "@/ports/input/user.port";
import { inject } from "inversify";
import type { LoginRoute, RegisterRoute } from "../routes/auth.routes";

export class AuthController {
	constructor(@inject(TYPES.UserApiPort) private userService: UserApiPort) {}

	login: AppRouteHandler<LoginRoute> = async (c) => {
		const { email, password, role } = c.req.valid("json");

		const token = await this.userService.loginUser({
			email,
			password,
			role,
		});

		return c.json(
			{
				token,
			},
			200,
		);
	};

	register: AppRouteHandler<RegisterRoute> = async (c) => {
		const userData = c.req.valid("json");

		const userId = await this.userService.registerUser({
			...userData,
			role: "USER",
		});

		return c.json({ userId }, 200);
	};
}
