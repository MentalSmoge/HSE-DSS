import {
	UserRepository,
	CreateUserCommand,
	User,
	UpdateUserCommand,
} from "../domain/user";
import { redisClient } from "../infrastructure/redis_client";
import { v4 as uuidv4 } from "uuid";

export class UserService {
	constructor(private userRepository: UserRepository) { }

	// Создание пользователя
	async createUser(command: CreateUserCommand): Promise<UserDTO> {
		const user = new User(uuidv4(), command.name, command.email);
		await redisClient.del("users:all");
		await this.userRepository.addUser(user);
		return this.toUserDTO(user);
	}

	// Получение пользователя по ID
	async getUserById(userId: string): Promise<UserDTO | null> {
		const cacheKey = `user:${userId}`;
		const cachedUser = await redisClient.get(cacheKey);
		if (cachedUser) {
			console.log("Cached " + userId)
			return JSON.parse(cachedUser);
		}
		const user = await this.userRepository.getUserById(userId);
		if (!user) return null;

		await redisClient.setEx(cacheKey, 300, JSON.stringify(user));
		return this.toUserDTO(user);
	}

	// Получение всех пользователей
	async getAllUsers(): Promise<UserDTO[]> {
		const cacheKey = "users:all";
		const cachedUsers = await redisClient.get(cacheKey);
		if (cachedUsers) {
			console.log("Cached " + cachedUsers)
			return JSON.parse(cachedUsers);
		}
		const users = await this.userRepository.getAllUsers();
		await redisClient.setEx(cacheKey, 300, JSON.stringify(users.map(user => this.toUserDTO(user))));
		return users.map(user => this.toUserDTO(user));
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
		await redisClient.del(`user:${userId}`);
		await redisClient.del("users:all");

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
