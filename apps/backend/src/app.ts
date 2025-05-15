import * as authRoutes from "@/adapters/driving/web/routes/auth.routes";
import * as bookingRoutes from "@/adapters/driving/web/routes/booking.routes";
import * as eventRoutes from "@/adapters/driving/web/routes/event.routes";
import configureOpenAPI from "@/common/util/configure-open-api";
import { createRouter } from "@/common/util/create-router";
import { cors } from "hono/cors";
import { AdminController } from "./adapters/driving/web/controllers/admin.controller";
import { AuthController } from "./adapters/driving/web/controllers/auth.controller";
import { BookingController } from "./adapters/driving/web/controllers/booking.controller";
import { EventController } from "./adapters/driving/web/controllers/event.controller";
import { errorHandler } from "./adapters/driving/web/middleware/error-handler.middleware";
import { loggerMiddleware } from "./adapters/driving/web/middleware/pino-logger.middleware";
import { rateLimiterMiddleware } from "./adapters/driving/web/middleware/rate-limiter.middleware";
import { mainContainer } from "./common/ioc";

function initializeRouters() {
	// Controllers
	const authController = mainContainer.get(AuthController);
	const adminController = mainContainer.get(AdminController);
	const eventController = mainContainer.get(EventController);
	const bookingController = mainContainer.get(BookingController);

	// Routers
	const authRouter = createRouter()
		.openapi(authRoutes.login, authController.login)
		.openapi(authRoutes.register, authController.register);

	const adminRouter = createRouter();

	const eventRouter = createRouter()
		.openapi(eventRoutes.getAllEvents, eventController.getAllEvents)
		.openapi(eventRoutes.createEvent, eventController.createEvent)
		.openapi(eventRoutes.updateEvent, eventController.updateEvent)
		.openapi(eventRoutes.deleteEvent, eventController.deleteEvent)
		.openapi(eventRoutes.getEventById, eventController.getEventById);

	const bookingRouter = createRouter()
		.openapi(bookingRoutes.createBooking, bookingController.createBooking)
		.openapi(bookingRoutes.deleteBooking, bookingController.deleteBooking)
		.openapi(bookingRoutes.getBookings, bookingController.getBookings);

	return { adminRouter, authRouter, eventRouter, bookingRouter };
}

// Initializes all middlewares etc
function bootstrap() {
	const app = createRouter();
	app.use(loggerMiddleware());
	app.use(rateLimiterMiddleware(50));

	// Configure CORS
	app.use(
		cors({
			origin: ["http://localhost:3002", "https://areeb-frontend.vercel.app"],
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowHeaders: [
				"Content-Type",
				"Authorization",
				"authorization",
				"content-type",
			],
			credentials: true,
			exposeHeaders: [
				"Content-Length",
				"authorization",
				"Authorization",
				"content-type",
			],
		}),
	);

	configureOpenAPI(app);

	const { adminRouter, authRouter, eventRouter, bookingRouter } =
		initializeRouters();

	return (
		app
			.route("/api/v1/auth", authRouter)
			.route("/api/v1/admin", adminRouter)
			.route("/api/v1/events", eventRouter)
			.route("/api/v1/bookings", bookingRouter)
			// Go to docs on /
			.get("/", (c) => c.redirect("/reference"))
			.onError(errorHandler)
	);
}

const _app = bootstrap();

export default _app;
