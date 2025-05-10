import { BaseError } from "./base-error";

export class EventNotFoundError extends BaseError {
	constructor(eventId: number) {
		super(`Event of ID ${eventId} is not found`);
	}
}
