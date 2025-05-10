import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import type { EventDetailsDTO } from "@/common/dtos/event-details.dto";
import type { UpdateEventDTO } from "@/common/dtos/update-event.dto";
import { EventNotFoundError } from "@/common/errors/event-not-found";
import { EventService } from "@/core/application/services/event.service";
import { Event } from "@/core/domain/entities/event";
import type { EventApiPort } from "@/ports/input/event";
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
		it("Should return a list of events", async () => {
			const mockEvents = [
				new Event({
					eventId: 1,
					eventName: "Test Event 1",
					description: "Test Description 1",
					category: "Test Category 1",
					date: "2024-01-01",
					venue: "Test Venue 1",
					price: 100,
					image: "test-image-1.jpg",
				}),
				new Event({
					eventId: 2,
					eventName: "Test Event 2",
					description: "Test Description 2",
					category: "Test Category 2",
					date: "2024-01-02",
					venue: "Test Venue 2",
					price: 200,
					image: "test-image-2.jpg",
				}),
			];

			mockEventRepo.getAll.mockResolvedValueOnce(mockEvents);

			const events = await service.getEventList();

			expect(events).toEqual(mockEvents);
			expect(mockEventRepo.getAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("getOne", () => {
		it("Should return an event when event exists", async () => {
			const mockEvent: EventDetailsDTO = {
				eventId: 1,
				eventName: "Test Event",
				description: "Test Description",
				category: "Test Category",
				date: "2024-01-01",
				venue: "Test Venue",
				price: 100,
				image: "test-image.jpg",
			};

			mockEventRepo.getById.mockResolvedValueOnce(mockEvent);

			const event = await service.getEventDetails(1);

			expect(event).toEqual(mockEvent);
			expect(mockEventRepo.getById).toHaveBeenCalledWith(1);
			expect(mockEventRepo.getById).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if event does not exist", async () => {
			mockEventRepo.getById.mockResolvedValueOnce(null);

			expect(service.getEventDetails(1)).rejects.toThrowError(EventNotFoundError);
			expect(mockEventRepo.getById).toHaveBeenCalledWith(1);
			expect(mockEventRepo.getById).toHaveBeenCalledTimes(1);
		});
	});

	describe("createEvent", () => {
		it("Should create an event successfully", async () => {
			const createEventDTO: CreateEventDTO = {
				eventName: "New Event",
				description: "New Description",
				category: "New Category",
				date: "2024-01-03",
				venue: "New Venue",
				price: 300,
				image: "new-image.jpg",
			};
			const mockEvent: EventDetailsDTO = {
				eventId: 3,
				eventName: "New Event",
				description: "New Description",
				category: "New Category",
				date: "2024-01-03",
				venue: "New Venue",
				price: 300,
				image: "new-image.jpg",
			};
			mockEventRepo.create.mockResolvedValueOnce(mockEvent);

			const newEvent = await service.createEvent(createEventDTO);

			expect(newEvent).toEqual(mockEvent);
			expect(mockEventRepo.create).toHaveBeenCalledWith(createEventDTO);
			expect(mockEventRepo.create).toHaveBeenCalledTimes(1);
		});
	});

	describe("updateEvent", () => {
		it("Should update an event successfully", async () => {
			const updateEventDTO: UpdateEventDTO = {
				eventName: "Updated Event",
				description: "Updated Description",
				category: "Updated Category",
				date: "2024-01-04",
				venue: "Updated Venue",
				price: 400,
				image: "updated-image.jpg",
			};
			const mockEvent: EventDetailsDTO = {
				eventId: 1,
				eventName: "Updated Event",
				description: "Updated Description",
				category: "Updated Category",
				date: "2024-01-04",
				venue: "Updated Venue",
				price: 400,
				image: "updated-image.jpg",
			};
			mockEventRepo.update.mockResolvedValueOnce(mockEvent);

			const updatedEvent = await service.updateEvent(1, updateEventDTO);

			expect(updatedEvent).toEqual(mockEvent);
			expect(mockEventRepo.update).toHaveBeenCalledWith(1, updateEventDTO);
			expect(mockEventRepo.update).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if event to update does not exist", async () => {
			const updateEventDTO: UpdateEventDTO = {
				eventName: "Updated Event",
				description: "Updated Description",
				category: "Updated Category",
				date: "2024-01-04",
				venue: "Updated Venue",
				price: 400,
				image: "updated-image.jpg",
			};
			mockEventRepo.update.mockResolvedValueOnce(null);

			expect(service.updateEvent(1, updateEventDTO)).rejects.toThrowError(
				EventNotFoundError,
			);
			expect(mockEventRepo.update).toHaveBeenCalledWith(1, updateEventDTO);
			expect(mockEventRepo.update).toHaveBeenCalledTimes(1);
		});
	});

	describe("deleteEvent", () => {
		it("Should delete an event successfully", async () => {
			const mockEvent: EventDetailsDTO = {
				eventId: 1,
				eventName: "Test Event",
				description: "Test Description",
				category: "Test Category",
				date: "2024-01-01",
				venue: "Test Venue",
				price: 100,
				image: "test-image.jpg",
			};
			mockEventRepo.delete.mockResolvedValueOnce(mockEvent);

			const deletedEvent = await service.deleteEvent(1);

			expect(deletedEvent).toEqual(mockEvent);
			expect(mockEventRepo.delete).toHaveBeenCalledWith(1);
			expect(mockEventRepo.delete).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if event to delete does not exist", async () => {
			mockEventRepo.delete.mockResolvedValueOnce(null);

			expect(service.deleteEvent(1)).rejects.toThrowError(EventNotFoundError);
			expect(mockEventRepo.delete).toHaveBeenCalledWith(1);
			expect(mockEventRepo.delete).toHaveBeenCalledTimes(1);
		});
	});
});
