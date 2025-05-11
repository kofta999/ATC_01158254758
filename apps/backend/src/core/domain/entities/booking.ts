export class Booking {
	bookingId: number;
	eventId: number;
	userId: number;
	createdAt: Date;

	constructor({
		bookingId,
		eventId,
		userId,
		createdAt,
	}: {
		bookingId: number;
		eventId: number;
		userId: number;
		createdAt: Date;
	}) {
		this.bookingId = bookingId;
		this.eventId = eventId;
		this.userId = userId;
		this.createdAt = createdAt;
	}
}
