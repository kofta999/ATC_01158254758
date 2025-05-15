import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import type { EventDetailsDTO } from "@/common/dtos/event-details.dto";
import type { UpdateEventDTO } from "@/common/dtos/update-event.dto";
import { ResourceNotFoundError } from "@/common/errors/resource-not-found";
import { EventService } from "@/core/application/services/event.service";
import { Event } from "@/core/domain/entities/event";
import type { EventApiPort } from "@/ports/input/event.port";
import {
	type MockEventRepository,
	createMockEventRepository,
} from "test/helpers/mock-event-repository";

describe("Event service", () => {
	let mockEventRepo: MockEventRepository;

	let service: EventApiPort;

	beforeEach(() => {
		mockEventRepo = createMockEventRepository();

		service = new EventService(mockEventRepo);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getEventList", () => {
		it("Should return a list of events with isBooked status", async () => {
			const mockEvents = [
				new Event({
					eventId: 1,
					eventName: "Test Event 1",
					description: "Test Description 1",
					category: "Business",
					date: "2024-01-01",
					venue: "Test Venue 1",
					price: 100,
					image: "test-image-1.jpg",
					availableTickets: 100,
					isBooked: false,
				}),
				new Event({
					eventId: 2,
					eventName: "Test Event 2",
					description: "Test Description 2",
					category: "Business",
					date: "2024-01-02",
					venue: "Test Venue 2",
					price: 200,
					image: "test-image-2.jpg",
					availableTickets: 50,
					isBooked: true,
				}),
			];

			mockEventRepo.getAll.mockResolvedValueOnce(mockEvents);

			const events = await service.getEventList();

			expect(events).toEqual(mockEvents);
			expect(events[0].isBooked).toBe(false);
			expect(events[1].isBooked).toBe(true);
			expect(mockEventRepo.getAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("getEventDetails", () => {
		// Renamed from getOne
		it("Should return an event with isBooked status when event exists", async () => {
			const mockEventData = {
				eventId: 1,
				eventName: "Test Event",
				description: "Test Description",
				category: "Business" as const,
				date: "2024-01-01",
				venue: "Test Venue",
				price: 100,
				image: "test-image.jpg",
				availableTickets: 100,
				isBooked: false,
			};
			const mockEventEntity = new Event(mockEventData);
			mockEventRepo.getById.mockResolvedValueOnce(mockEventEntity);

			const eventDetails = await service.getEventDetails(1);

			expect(eventDetails).toEqual(mockEventEntity);
			expect(eventDetails.isBooked).toBe(false);
			expect(mockEventRepo.getById).toHaveBeenCalledWith(1);
			expect(mockEventRepo.getById).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if event does not exist", async () => {
			mockEventRepo.getById.mockResolvedValueOnce(null);

			await expect(service.getEventDetails(1)).rejects.toThrowError(
				ResourceNotFoundError,
			);
			expect(mockEventRepo.getById).toHaveBeenCalledWith(1);
			expect(mockEventRepo.getById).toHaveBeenCalledTimes(1);
		});
	});

	describe("createEvent", () => {
		it("Should create an event successfully with isBooked as false", async () => {
			const createEventDTO: CreateEventDTO = {
				eventName: "New Event",
				description: "New Description",
				category: "Business",
				date: "2024-01-03",
				venue: "New Venue",
				price: 300,
				image: "new-image.jpg",
				availableTickets: 100,
			};
			const expectedCreatedEvent = new Event({
				eventId: 3,
				...createEventDTO,
				isBooked: false, // New events are not booked
			});
			mockEventRepo.create.mockResolvedValueOnce(expectedCreatedEvent);

			const newEvent = await service.createEvent(createEventDTO);

			expect(newEvent).toEqual(expectedCreatedEvent);
			expect(newEvent.isBooked).toBe(false);
			expect(mockEventRepo.create).toHaveBeenCalledWith(createEventDTO);
			expect(mockEventRepo.create).toHaveBeenCalledTimes(1);
		});
	});

	describe("updateEvent", () => {
		it("Should update an event successfully and return it with isBooked status", async () => {
			const updateEventDTO: UpdateEventDTO = {
				eventName: "Updated Event",
				description: "Updated Description",
				category: "Business",
				date: "2024-01-04",
				venue: "Updated Venue",
				price: 400,
				image: "updated-image.jpg",
			};
			const expectedUpdatedEvent = new Event({
				eventId: 1,
				eventName: "Updated Event",
				description: "Updated Description",
				category: "Business",
				date: "2024-01-04",
				venue: "Updated Venue",
				price: 400,
				image: "updated-image.jpg",
				availableTickets: 50,
				isBooked: true,
			});
			mockEventRepo.update.mockResolvedValueOnce(expectedUpdatedEvent);

			const updatedEvent = await service.updateEvent(1, updateEventDTO);

			expect(updatedEvent).toEqual(expectedUpdatedEvent);
			expect(updatedEvent.isBooked).toBe(true);
			expect(mockEventRepo.update).toHaveBeenCalledWith(1, updateEventDTO);
			expect(mockEventRepo.update).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if event to update does not exist", async () => {
			const updateEventDTO: UpdateEventDTO = {
				eventName: "Updated Event",
				description: "Updated Description",
				category: "Business",
				date: "2024-01-04",
				venue: "Updated Venue",
				price: 400,
				image: "updated-image.jpg",
			};
			mockEventRepo.update.mockResolvedValueOnce(null);

			expect(service.updateEvent(1, updateEventDTO)).rejects.toThrowError(
				ResourceNotFoundError,
			);
			expect(mockEventRepo.update).toHaveBeenCalledWith(1, updateEventDTO);
			expect(mockEventRepo.update).toHaveBeenCalledTimes(1);
		});
	});

	describe("deleteEvent", () => {
		it("Should delete an event successfully and return its previous state", async () => {
			const eventToBeDeleted = new Event({
				eventId: 1,
				eventName: "Test Event",
				description: "Test Description",
				category: "Business",
				date: "2024-01-01",
				venue: "Test Venue",
				price: 100,
				image: "test-image.jpg",
				availableTickets: 100,
				isBooked: false,
			});
			mockEventRepo.delete.mockResolvedValueOnce(eventToBeDeleted);

			const deletedEvent = await service.deleteEvent(1);

			expect(deletedEvent).toEqual(eventToBeDeleted);
			expect(deletedEvent.isBooked).toBe(false);
			expect(mockEventRepo.delete).toHaveBeenCalledWith(1);
			expect(mockEventRepo.delete).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if event to delete does not exist", async () => {
			mockEventRepo.delete.mockResolvedValueOnce(null);

			expect(service.deleteEvent(1)).rejects.toThrowError(
				ResourceNotFoundError,
			);
			expect(mockEventRepo.delete).toHaveBeenCalledWith(1);
			expect(mockEventRepo.delete).toHaveBeenCalledTimes(1);
		});
	});
});
