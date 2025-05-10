import { CreateEventSchema } from "@/common/dtos/create-event.dto";
import { EventDetailsSchema } from "@/common/dtos/event-details.dto";
import { EventListSchema } from "@/common/dtos/event-list.dto";
import { UpdateEventSchema } from "@/common/dtos/update-event.dto";
import { ErrorSchema } from "@/common/schemas/error-schema";
import { IdSchema } from "@/common/schemas/id-schema";
import jsonContent from "@/common/util/json-content";
import { createRoute } from "@hono/zod-openapi";

const tags = ["Events"];

export const getAllEvents = createRoute({
	path: "/",
	method: "get",
	tags,
	summary: "Get all events",
	responses: {
		200: jsonContent(EventListSchema, "List of events"),
	},
});

export type GetAllEventsRoute = typeof getAllEvents;

export const getEventById = createRoute({
	path: "/{id}",
	method: "get",
	tags,
	summary: "Get event by ID",
	request: {
		params: IdSchema,
	},
	responses: {
		200: jsonContent(EventDetailsSchema, "Event details"),
		404: jsonContent(ErrorSchema, "Event not found"),
	},
});

export type GetEventByIdRoute = typeof getEventById;

export const createEvent = createRoute({
	path: "/",
	method: "post",
	tags,
	summary: "Create a new event",
	request: {
		body: jsonContent(CreateEventSchema, "Event data"),
	},
	responses: {
		201: jsonContent(EventDetailsSchema, "Created event"),
		// TODO: Add 422 errors
	},
});

export type CreateEventRoute = typeof createEvent;

export const updateEvent = createRoute({
	path: "/{id}",
	method: "put",
	tags,
	summary: "Update an event",
	request: {
		params: IdSchema,
		body: jsonContent(UpdateEventSchema, "Updated event data"),
	},
	responses: {
		200: jsonContent(EventDetailsSchema, "Updated event"),
		404: jsonContent(ErrorSchema, "Event not found"),
	},
});

export type UpdateEventRoute = typeof updateEvent;

export const deleteEvent = createRoute({
	path: "/{id}",
	method: "delete",
	tags,
	summary: "Delete an event",
	request: {
		params: IdSchema,
	},
	responses: {
		200: jsonContent(EventDetailsSchema, "Deleted event"),
		404: jsonContent(ErrorSchema, "Event not found"),
	},
});

export type DeleteEventRoute = typeof deleteEvent;
