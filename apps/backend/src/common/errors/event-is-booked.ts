import { BaseError } from "./base-error";

export class EventIsBookedError extends BaseError {
	constructor(eventId: number) {
		super(`Event ${eventId} is already booked, cannot be deleted`);
	}
}
