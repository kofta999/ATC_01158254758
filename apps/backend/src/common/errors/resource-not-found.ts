import { BaseError } from "./base-error";

export class ResourceNotFoundError extends BaseError {
	constructor(resource: string, resourceId: number) {
		super(`${resource} of ID ${resourceId} is not found`);
	}
}
