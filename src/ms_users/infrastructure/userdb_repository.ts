import { Pool } from "pg";
import { User, UserRepository } from "../domain/user";
import { sendUserUpdate } from "../kafka";

export class PostgreSQLUserRepository implements UserRepository {
	constructor(private pool: InstanceType<typeof Pool>) { }

	async checkConnection(): Promise<void> {
		try {
			const res = await this.pool.query("SELECT NOW()");
			console.log("Database connected:", res.rows[0]);
		} catch (err) {
			console.error("Database connection error:", err);
		}
	}
	async addUser(user: User): Promise<void> {
		await this.pool.query(
			"INSERT INTO users(id, name, email) VALUES($1, $2, $3)",
			[user.id, user.name, user.email]
		);
		sendUserUpdate(user)
	}
	async getUserById(id: string): Promise<User | null> {
		const result = await this.pool.query(
			"SELECT id, name, email FROM users WHERE id = $1",
			[id]
		);

		if (result.rows.length === 0) {
			return null;
		}

		const userData = result.rows[0];
		return new User(userData.id, userData.name, userData.email);
	}
	async getAllUsers(): Promise<User[]> {
		const result = await this.pool.query(
			'SELECT id, name, email FROM users'
		);
		sendUserUpdate(result.rows)

		return result.rows.map(row => new User(
			row.id,
			row.name,
			row.email
		));
	}
	// Обновление пользователя
	async updateUser(user: User): Promise<void> {
		await this.pool.query(
			"UPDATE users SET name = $1, email = $2 WHERE id = $3",
			[user.name, user.email, user.id]
		);
	}
	// Удаление пользователя
	async deleteUser(id: string): Promise<boolean> {
		const result = await this.pool.query(
			"DELETE FROM users WHERE id = $1",
			[id]
		);
		return result.rowCount! > 0;
	}
}
export function createPool(): InstanceType<typeof Pool> {
	return new Pool({
		user: process.env.DB_USER,
		host: process.env.DB_HOST || "user_db",
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT!),
	});
}
