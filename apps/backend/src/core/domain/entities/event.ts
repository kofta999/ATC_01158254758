export class Event {
	eventId: number;
	eventName: string;
	description: string;
	category: string;
	date: string;
	venue: string;
	price: number;
	image: string;

	constructor({
		eventId,
		eventName,
		description,
		category,
		date,
		venue,
		price,
		image,
	}: {
		eventId: number;
		eventName: string;
		description: string;
		category: string;
		date: string;
		venue: string;
		price: number;
		image: string;
	}) {
		this.eventId = eventId;
		this.eventName = eventName;
		this.description = description;
		this.category = category;
		this.date = date;
		this.venue = venue;
		this.price = price;
		this.image = image;
	}
}
