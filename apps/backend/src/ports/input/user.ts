import type { LoginUserDTO } from "@/common/dtos/login-user.dto";
import type { User } from "@/core/domain/entities/user";

export interface UserApiPort {
	loginUser(dto: LoginUserDTO): Promise<string>;
	registerUser(
		newUser: Pick<User, "email" | "password" | "role">,
	): Promise<number>;
}
