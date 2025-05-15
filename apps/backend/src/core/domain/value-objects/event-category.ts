export const eventCategory = [
	"Music",
	"Sports",
	"Conference",
	"Food & Drink",
	"Arts & Culture",
	"Business",
	"Health & Wellness",
	"Film & Media",
	"Community",
	"Tours & Sightseeing",
	"Technology",
	"Charity & Causes",
	"Workshops & Classes",
	"Hobbies & Skills",
	"Literature",
	"Gaming",
	"Seasonal",
	"Business & Entrepreneurship",
	"Sports & Fitness",
	"Holiday & Celebration",
] as const;

export type EventCategory = (typeof eventCategory)[number];
