import { TYPES } from "@/common/types";
import { User } from "@/core/domain/entities/user";
import type { UserRepositoryPort } from "@/ports/output/repositories/user.repository.port";
import { inject } from "inversify";
import type { DrizzleDataSource } from "../../data-sources/drizzle/drizzle.data-source";
import { userTable } from "../../data-sources/drizzle/schema";

export class UserDatabaseRepository implements UserRepositoryPort {
	db: DrizzleDataSource;

	constructor(@inject(TYPES.DrizzleDataSource) db: DrizzleDataSource) {
		this.db = db;
	}

	async create(user: User): Promise<number> {
		const newUser = await this.db
			.insert(userTable)
			.values({ email: user.email, password: user.password, role: user.role })
			.returning({ id: userTable.userId });

		return newUser[0].id;
	}

	async getById(userId: number): Promise<User | null> {
		const user = await this.db.query.userTable.findFirst({
			where: (f, { eq }) => eq(f.userId, userId),
		});

		if (!user) {
			return null;
		}

		return new User({
			...user,
			createdAt: new Date(user.createdAt),
		});
	}

	async getByEmail(email: string): Promise<User | null> {
		const user = await this.db.query.userTable.findFirst({
			where: (f, { eq }) => eq(f.email, email),
		});

		if (!user) {
			return null;
		}

		return new User({
			...user,
			createdAt: new Date(user.createdAt),
		});
	}
}
