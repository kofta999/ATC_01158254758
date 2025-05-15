import type { EventCategory } from "../value-objects/event-category";

export class Event {
	eventId: number;
	eventName: string;
	description: string;
	category: EventCategory;
	date: string;
	venue: string;
	price: number;
	image: string;
	availableTickets: number;
	isBooked: boolean;

	constructor({
		eventId,
		eventName,
		description,
		category,
		date,
		venue,
		price,
		image,
		availableTickets,
		isBooked,
	}: {
		eventId: number;
		eventName: string;
		description: string;
		category: EventCategory;
		date: string;
		venue: string;
		price: number;
		image: string;
		availableTickets: number;
		isBooked: boolean;
	}) {
		this.eventId = eventId;
		this.eventName = eventName;
		this.description = description;
		this.category = category;
		this.date = date;
		this.venue = venue;
		this.price = price;
		this.image = image;
		this.availableTickets = availableTickets;
		this.isBooked = isBooked;
	}
}
