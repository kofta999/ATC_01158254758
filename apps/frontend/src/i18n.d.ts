import "i18next";
import type translationEN from "./lib/intl/en";

declare module "i18next" {
	interface CustomTypeOptions {
		returnNull: false;
		defaultNS: "translation";
		resources: {
			translation: typeof translationEN;
		};
	}
}
