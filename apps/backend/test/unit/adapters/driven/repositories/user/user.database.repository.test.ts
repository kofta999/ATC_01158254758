import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { UserDatabaseRepository } from "@/adapters/driven/database/repositories/user/user.database.repository";
import { User } from "@/core/domain/entities/user";
import type { DrizzleDataSource } from "@/adapters/driven/database/data-sources/drizzle/drizzle.data-source";
import { userTable } from "@/adapters/driven/database/data-sources/drizzle/schema";
import { eq } from "drizzle-orm";

describe("User database repository", () => {
	let mockDb: {
		insert: ReturnType<typeof jest.fn>;
		query: {
			userTable: {
				findFirst: ReturnType<typeof jest.fn>;
			};
		};
	};
	let repo: UserDatabaseRepository;

	beforeEach(() => {
		mockDb = {
			insert: jest.fn().mockReturnThis(),
			query: {
				userTable: {
					findFirst: jest.fn(),
				},
			},
		};
		repo = new UserDatabaseRepository(mockDb as unknown as DrizzleDataSource);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("Should create a user and return userId", async () => {
			const mockNewUser = [{ id: 1 }];
			(mockDb.insert as jest.Mock).mockResolvedValueOnce(mockNewUser);

			const user = new User({
				email: "test",
				password: "test",
				role: "BUSINESS",
			});

			const userId = await repo.create(user);

			expect(userId).toBe(1);
			expect(mockDb.insert).toHaveBeenCalledTimes(1);
			expect(mockDb.insert).toHaveBeenCalledWith(userTable);
		});
	});

	describe("getById", () => {
		it("Should get a user by its ID", async () => {
			const mockUserData = {
				userId: 1,
				email: "test",
				password: "test",
				role: "BUSINESS",
				createdAt: new Date(),
			};

			(mockDb.query.userTable.findFirst as jest.Mock).mockResolvedValueOnce(
				mockUserData,
			);

			const userId = 1;

			const user = (await repo.getById(userId)) as User;

			expect(user).toBeInstanceOf(User);
			expect(user.userId).toBe(mockUserData.userId);
			expect(user.email).toBe(mockUserData.email);
			expect(user.password).toBe(mockUserData.password);
			expect(mockDb.query.userTable.findFirst).toHaveBeenCalledTimes(1);
			expect(mockDb.query.userTable.findFirst).toHaveBeenCalledWith({
				where: eq(userTable.userId, userId),
			});
		});

		it("Should return null if user is not found", async () => {
			(mockDb.query.userTable.findFirst as jest.Mock).mockResolvedValueOnce(
				undefined,
			);

			const user = await repo.getById(999);

			expect(user).toBe(null);
			expect(mockDb.query.userTable.findFirst).toHaveBeenCalledTimes(1);
		});
	});

	describe("getByEmail", () => {
		it("Should get a user by its email", async () => {
			const mockUserData = {
				userId: 1,
				email: "test",
				password: "test",
				role: "BUSINESS",
				createdAt: new Date(),
			};
			(mockDb.query.userTable.findFirst as jest.Mock).mockResolvedValueOnce(
				mockUserData,
			);

			const email = "test";

			const user = (await repo.getByEmail(email)) as User;

			expect(user).toBeInstanceOf(User);
			expect(user.userId).toBe(mockUserData.userId);
			expect(user.email).toBe(mockUserData.email);
			expect(user.password).toBe(mockUserData.password);
			expect(mockDb.query.userTable.findFirst).toHaveBeenCalledTimes(1);
			expect(mockDb.query.userTable.findFirst).toHaveBeenCalledWith({
				where: eq(userTable.email, email),
			});
		});

		it("Should return null if user is not found", async () => {
			(mockDb.query.userTable.findFirst as jest.Mock).mockResolvedValueOnce(
				undefined,
			);

			const user = await repo.getByEmail("test");

			expect(user).toBe(null);
			expect(mockDb.query.userTable.findFirst).toHaveBeenCalledTimes(1);
		});
	});
});
