import { BaseApiError } from "@/common/errors/base-api-error";
import { BaseError } from "@/common/errors/base-error";
import { EventIsBookedError } from "@/common/errors/event-is-booked";
import { InvalidCredentialsError } from "@/common/errors/invalid-credentials";
import { ResourceAlreadyExists } from "@/common/errors/resource-already-exists";
import { ResourceNotFoundError } from "@/common/errors/resource-not-found";
import { UnauthorizedError } from "@/common/errors/unauthorized";
import { UserNotFoundError } from "@/common/errors/user-not-found";
import type { AppBindings } from "@/common/types";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorHandler: ErrorHandler<AppBindings> = (err, c) => {
	let [statusCode, errorMessage]: [ContentfulStatusCode, string] = [
		500,
		"Internal Server Error",
	];

	if (err instanceof BaseError) {
		switch (true) {
			case err instanceof ResourceNotFoundError:
			case err instanceof UserNotFoundError: {
				[statusCode, errorMessage] = [404, err.message];
				break;
			}

			case err instanceof InvalidCredentialsError:
			case err instanceof UnauthorizedError: {
				[statusCode, errorMessage] = [401, err.message];
				break;
			}

			case err instanceof ResourceAlreadyExists:
			case err instanceof EventIsBookedError: {
				[statusCode, errorMessage] = [409, err.message];
				break;
			}
		}
	} else if (err instanceof BaseApiError) {
		[statusCode, errorMessage] = [err.code, err.message];
	}

	return c.json({ message: errorMessage }, statusCode);
};
