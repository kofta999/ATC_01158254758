import type { AppOpenAPI } from "@/common/types";
import { Scalar } from "@scalar/hono-api-reference";

export default function configureOpenAPI(app: AppOpenAPI) {
	const securitySchemes = {
		bearerAuth: {
			type: "http" as const,
			scheme: "bearer" as const,
			bearerFormat: "JWT" as const,
		},
	};

	app.openAPIRegistry.registerComponent(
		"securitySchemes",
		"bearerAuth",
		securitySchemes.bearerAuth,
	);

	app.doc("/doc", {
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Areeb Challenge API Documentation",
		},
	});

	app.get(
		"/reference",
		Scalar({
			url: "/doc",
			pageTitle: "Areeb Challenge API Documentation",
		}),
	);
}
