import { type Mock, mock } from "bun:test";
import type { CreateEventDTO } from "@/common/dtos/create-event.dto";
import type { UpdateEventDTO } from "@/common/dtos/update-event.dto";
import type { Event } from "@/core/domain/entities/event";
import type { EventRepositoryPort } from "@/ports/output/repositories/event.repository.port";

export interface MockEventRepository extends EventRepositoryPort {
	getAll: Mock<() => Promise<Event[]>>;
	getById: Mock<(eventId: number) => Promise<Event | null>>;
	create: Mock<(event: CreateEventDTO) => Promise<Event>>;
	update: Mock<
		(eventId: number, updatedEvent: UpdateEventDTO) => Promise<Event | null>
	>;
	delete: Mock<(eventId: number) => Promise<Event | null>>;
	invalidateCache: Mock<(eventId: number) => Promise<void>>;
	decreaseTickets: Mock<(eventId: number) => Promise<void>>;
	increaseTickets: Mock<(eventId: number) => Promise<void>>;
}

export function createMockEventRepository(): MockEventRepository {
	return {
		getAll: mock(() => Promise.resolve([])),
		getById: mock((eventId: number) => Promise.resolve(null)),
		create: mock((event: CreateEventDTO) => Promise.resolve({} as Event)),
		update: mock((eventId: number, updatedEvent: UpdateEventDTO) =>
			Promise.resolve(null),
		),
		delete: mock((eventId: number) => Promise.resolve(null)),
		invalidateCache: mock((eventId: number) => Promise.resolve()),
		decreaseTickets: mock((eventId: number) => Promise.resolve()),
		increaseTickets: mock((eventId: number) => Promise.resolve()),
	};
}
