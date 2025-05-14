import translationAR from "@/lib/intl/ar";
import translationEN from "@/lib/intl/en";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// the translations
const resources = {
	en: {
		translation: translationEN,
	},
	ar: {
		translation: translationAR,
	},
};

i18n
	.use(LanguageDetector) // detect user language
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		fallbackLng: "en", // fallback language is english
		debug: true,
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});

i18n.on("languageChanged", () =>
	document.querySelector("#main")?.setAttribute("dir", i18n.dir()),
);

export default i18n;
