export class User {
	constructor(
		public id: string,
		public name: string,
		public email: string
	) { }
}
export interface UserRepository {
	checkConnection(): Promise<void>;
	addUser(user: User): Promise<void>;
	getUserById(id: string): Promise<User | null>;
	updateUser(user: User): Promise<void>;
	deleteUser(id: string): Promise<void>;
}
export class CreateUserCommand {
	constructor(public name: string, public email: string) { }
}

export class UserCreatedEvent {
	constructor(public user: User) { }
}