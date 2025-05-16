import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
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
		it("Should return a list of events ", async () => {
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
				}),
			];

			mockEventRepo.getAll.mockResolvedValueOnce(mockEvents);
			mockEventRepo.count.mockResolvedValueOnce(mockEvents.length);

			const pagination = { limit: mockEvents.length, page: 1 };
			const events = await service.getEventList({
				pagination,
			});

			expect(events).toEqual({
				data: mockEvents,
				meta: {
					totalItems: mockEvents.length,
					totalPages: 1,
					currentPage: 1,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			});
			expect(mockEventRepo.getAll).toHaveBeenCalledTimes(1);
		});

		it("Should return a list of events with pagination", async () => {
			const mockEvents = [
				new Event({
					eventId: 1,
					eventName: "Event 1",
					description: "Desc 1",
					category: "Business",
					date: "2024-01-01",
					venue: "Venue 1",
					price: 10,
					image: "img1.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 2,
					eventName: "Event 2",
					description: "Desc 2",
					category: "Music",
					date: "2024-01-02",
					venue: "Venue 2",
					price: 20,
					image: "img2.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 3,
					eventName: "Event 3",
					description: "Desc 3",
					category: "Sports",
					date: "2024-01-03",
					venue: "Venue 3",
					price: 30,
					image: "img3.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 4,
					eventName: "Event 4",
					description: "Desc 4",
					category: "Technology",
					date: "2024-01-04",
					venue: "Venue 4",
					price: 40,
					image: "img4.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 5,
					eventName: "Event 5",
					description: "Desc 5",
					category: "Business",
					date: "2024-01-05",
					venue: "Venue 5",
					price: 50,
					image: "img5.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 6,
					eventName: "Event 6",
					description: "Desc 6",
					category: "Music",
					date: "2024-01-06",
					venue: "Venue 6",
					price: 60,
					image: "img6.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 7,
					eventName: "Event 7",
					description: "Desc 7",
					category: "Sports",
					date: "2024-01-07",
					venue: "Venue 7",
					price: 70,
					image: "img7.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 8,
					eventName: "Event 8",
					description: "Desc 8",
					category: "Technology",
					date: "2024-01-08",
					venue: "Venue 8",
					price: 80,
					image: "img8.jpg",
					availableTickets: 100,
				}),
			];
			const paginatedEvents = [
				new Event({
					eventId: 6,
					eventName: "Event 6",
					description: "Desc 6",
					category: "Music",
					date: "2024-01-06",
					venue: "Venue 6",
					price: 60,
					image: "img6.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 7,
					eventName: "Event 7",
					description: "Desc 7",
					category: "Sports",
					date: "2024-01-07",
					venue: "Venue 7",
					price: 70,
					image: "img7.jpg",
					availableTickets: 100,
				}),
				new Event({
					eventId: 8,
					eventName: "Event 8",
					description: "Desc 8",
					category: "Technology",
					date: "2024-01-08",
					venue: "Venue 8",
					price: 80,
					image: "img8.jpg",
					availableTickets: 100,
				}),
			];

			mockEventRepo.count.mockResolvedValueOnce(mockEvents.length);
			mockEventRepo.getAll.mockResolvedValueOnce(paginatedEvents);

			const pagination = { limit: 5, page: 2 };
			const events = await service.getEventList({
				pagination,
			});

			expect(events).toEqual({
				data: paginatedEvents,
				meta: {
					totalItems: mockEvents.length,
					totalPages: Math.ceil(mockEvents.length / pagination.limit),
					currentPage: pagination.page,
					hasNextPage: false,
					hasPreviousPage: true,
				},
			});
			expect(mockEventRepo.count).toHaveBeenCalledWith({
				limit: 5,
				offset: 5,
				category: undefined,
			});
			expect(mockEventRepo.getAll).toHaveBeenCalledWith({
				limit: 5,
				offset: 5,
				category: undefined,
			});
			expect(mockEventRepo.count).toHaveBeenCalledTimes(1);
			expect(mockEventRepo.getAll).toHaveBeenCalledTimes(1);
		});

		it("Should return a list of events filtered by category", async () => {
			const allEvents = [
				new Event({
					eventId: 1,
					eventName: "Business Event 1",
					description: "Business Desc 1",
					category: "Business",
					date: "2024-02-01",
					venue: "Business Venue 1",
					price: 100,
					image: "business1.jpg",
					availableTickets: 50,
				}),
				new Event({
					eventId: 2,
					eventName: "Music Event 1",
					description: "Music Desc 1",
					category: "Music",
					date: "2024-02-02",
					venue: "Music Venue 1",
					price: 200,
					image: "music1.jpg",
					availableTickets: 75,
				}),
				new Event({
					eventId: 3,
					eventName: "Business Event 2",
					description: "Business Desc 2",
					category: "Business",
					date: "2024-02-03",
					venue: "Business Venue 2",
					price: 150,
					image: "business2.jpg",
					availableTickets: 60,
				}),
				new Event({
					eventId: 4,
					eventName: "Music Event 2",
					description: "Music Desc 2",
					category: "Music",
					date: "2024-02-04",
					venue: "Music Venue 2",
					price: 250,
					image: "music2.jpg",
					availableTickets: 80,
				}),
			];
			const businessEvents = [
				new Event({
					eventId: 1,
					eventName: "Business Event 1",
					description: "Business Desc 1",
					category: "Business",
					date: "2024-02-01",
					venue: "Business Venue 1",
					price: 100,
					image: "business1.jpg",
					availableTickets: 50,
				}),
				new Event({
					eventId: 3,
					eventName: "Business Event 2",
					description: "Business Desc 2",
					category: "Business",
					date: "2024-02-03",
					venue: "Business Venue 2",
					price: 150,
					image: "business2.jpg",
					availableTickets: 60,
				}),
			];

			mockEventRepo.count.mockResolvedValueOnce(businessEvents.length);
			mockEventRepo.getAll.mockResolvedValueOnce(businessEvents);

			const pagination = { limit: 10, page: 1 };
			const filter = { category: "Business" as const };
			const events = await service.getEventList({
				pagination,
				filter,
			});

			expect(events).toEqual({
				data: businessEvents,
				meta: {
					totalItems: businessEvents.length,
					totalPages: Math.ceil(businessEvents.length / pagination.limit),
					currentPage: pagination.page,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			});
			expect(mockEventRepo.count).toHaveBeenCalledWith({
				limit: 10,
				offset: 0,
				category: "Business",
			});
			expect(mockEventRepo.getAll).toHaveBeenCalledWith({
				limit: 10,
				offset: 0,
				category: "Business",
			});
			expect(mockEventRepo.count).toHaveBeenCalledTimes(1);
			expect(mockEventRepo.getAll).toHaveBeenCalledTimes(1);
		});

		it("Should return an empty list and correct meta if no events match the criteria", async () => {
			mockEventRepo.count.mockResolvedValueOnce(0);
			mockEventRepo.getAll.mockResolvedValueOnce([]);

			const pagination = { limit: 10, page: 1 };
			const filter = { category: "Nonexistent" as const };
			const events = await service.getEventList({
				pagination,
				// @ts-expect-error Custom category for tests
				filter,
			});

			expect(events).toEqual({
				data: [],
				meta: {
					totalItems: 0,
					totalPages: 0,
					currentPage: pagination.page,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			});
			expect(mockEventRepo.count).toHaveBeenCalledWith({
				limit: 10,
				offset: 0,
				category: "Nonexistent",
			});
			expect(mockEventRepo.getAll).toHaveBeenCalledWith({
				limit: 10,
				offset: 0,
				category: "Nonexistent",
			});
			expect(mockEventRepo.count).toHaveBeenCalledTimes(1);
			expect(mockEventRepo.getAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("getEventDetails", () => {
		// Renamed from getOne
		it("Should return an event when event exists", async () => {
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
			};
			const mockEventEntity = new Event(mockEventData);
			mockEventRepo.getById.mockResolvedValueOnce(mockEventEntity);

			const eventDetails = await service.getEventDetails(1);

			expect(eventDetails).toEqual(mockEventEntity);
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
		it("Should create an event successfully", async () => {
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
				// New events are not booked
			});
			mockEventRepo.create.mockResolvedValueOnce(expectedCreatedEvent);

			const newEvent = await service.createEvent(createEventDTO);

			expect(newEvent).toEqual(expectedCreatedEvent);
			expect(mockEventRepo.create).toHaveBeenCalledWith(createEventDTO);
			expect(mockEventRepo.create).toHaveBeenCalledTimes(1);
		});
	});

	describe("updateEvent", () => {
		it("Should update an event successfully and return it", async () => {
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
			});
			mockEventRepo.update.mockResolvedValueOnce(expectedUpdatedEvent);

			const updatedEvent = await service.updateEvent(1, updateEventDTO);

			expect(updatedEvent).toEqual(expectedUpdatedEvent);
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
			});
			mockEventRepo.delete.mockResolvedValueOnce(eventToBeDeleted);

			const deletedEvent = await service.deleteEvent(1);

			expect(deletedEvent).toEqual(eventToBeDeleted);
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
