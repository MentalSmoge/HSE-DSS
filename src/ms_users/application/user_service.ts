import {
	UserRepository,
	CreateUserCommand,
	User,
	UpdateUserCommand,
} from "../domain/user";
import { v4 as uuidv4 } from "uuid";

export class UserService {
	constructor(private userRepository: UserRepository) {}

	// Создание пользователя
	async createUser(command: CreateUserCommand): Promise<UserDTO> {
		const user = new User(uuidv4(), command.name, command.email);
		await this.userRepository.addUser(user);
		return this.toUserDTO(user);
	}

	// Получение пользователя по ID
	async getUserById(userId: string): Promise<UserDTO | null> {
		const user = await this.userRepository.getUserById(userId);
		return user ? this.toUserDTO(user) : null;
	}

	// Обновление пользователя
	async updateUser(
		userId: string,
		command: UpdateUserCommand
	): Promise<UserDTO | null> {
		const user = await this.userRepository.getUserById(userId);
		if (!user) {
			return null;
		}

		user.name = command.name;
		user.email = command.email;
		await this.userRepository.updateUser(user);

		return this.toUserDTO(user);
	}

	// Удаление пользователя
	async deleteUser(userId: string): Promise<boolean> {
		return this.userRepository.deleteUser(userId);
	}

	// Преобразование User в UserDTO
	private toUserDTO(user: User): UserDTO {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}
}

export interface UserDTO {
	id: string;
	name: string;
	email: string;
}
