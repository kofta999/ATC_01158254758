import * as authRoutes from "@/adapters/driving/web/routes/auth.routes";
import configureOpenAPI from "@/common/util/configure-open-api";
import { createRouter } from "@/common/util/create-router";
import { AdminController } from "./adapters/driving/web/controllers/admin.controller";
import { AuthController } from "./adapters/driving/web/controllers/auth.controller";
import { errorHandler } from "./adapters/driving/web/middleware/error-handler.middleware";
import { loggerMiddleware } from "./adapters/driving/web/middleware/pino-logger.middleware";
import { rateLimiterMiddleware } from "./adapters/driving/web/middleware/rate-limiter.middleware";
import { mainContainer } from "./common/ioc";

function initializeRouters() {
	// Controllers
	const authController = mainContainer.get(AuthController);
	const adminController = mainContainer.get(AdminController);

	// Routers
	const authRouter = createRouter()
		.openapi(authRoutes.login, authController.login)
		.openapi(authRoutes.register, authController.register);

	const adminRouter = createRouter();

	return { adminRouter, authRouter };

	// app
}

// Initializes all middlewares etc
function bootstrap() {
	const app = createRouter();
	app.use(loggerMiddleware());
	app.use(rateLimiterMiddleware(50));

	configureOpenAPI(app);

	const { adminRouter, authRouter } = initializeRouters();

	return (
		app
			.route("/api/v1/auth", authRouter)
			.route("/api/v1/admin", adminRouter)
			// Go to docs on /
			.get("/", (c) => c.redirect("/reference"))
			.onError(errorHandler)
	);
}

const _app = bootstrap();

export default _app;
